import {
  Data,
  Option,
  Array,
  pipe,
  Either,
  Predicate,
  HashMap,
  HashSet,
  Tuple,
  Match,
  Pipeable,
  Iterable,
  Equal,
  MutableHashMap,
} from "effect";
import * as Cell from "./Cell.ts";
import * as Side from "./Side.ts";
import * as CellBorder from "./CellBorder.ts";
import * as Coords from "./Coords.ts";
import * as Bug from "./Bug.ts";
import * as SwarmMember from "./SwarmMember.ts";
import { dual } from "effect/Function";
import { distributive } from "../shared/effect/Types.ts";
import { QueenBeeState } from "./QueenBeeState.ts";
import * as SwarmError from "./SwarmError.ts";
import * as GameMove from "./GameMove.ts";

interface CoordsCell {
  readonly white: HashMap.HashMap<Coords.Coords, Cell.Occupied>;
  readonly black: HashMap.HashMap<Coords.Coords, Cell.Occupied>;
}

export interface Swarm extends Pipeable.Pipeable {}
export class Swarm extends Data.Class<{
  field: HashMap.HashMap<Coords.Coords, SwarmMember.SwarmMember>;
  lastMoved: Bug.Bug;
  lastMovedByPillbug: boolean;
}> {
  static {
    this.prototype.pipe = function () {
      return Pipeable.pipeArguments(this, arguments);
    };
  }

  private getFor<C extends Cell.Cell>(
    cell: C,
    cache: {
      reversedField: HashMap.HashMap<Coords.Coords, Cell.Occupied>;
      cellCache: Map<string, Cell.Cell>;
    }
  ): C {
    const isPassed = cache.cellCache.has(cell.coords.toString());
    if (isPassed) {
      return cell;
    }
    const neighborsCoords = Coords.Coords.Neighbors(cell.coords);

    cache.cellCache.set(cell.coords.toString(), cell);

    Tuple.map(CellBorder.CellBorders, (cellBorder) => {
      const neighborCoords = neighborsCoords[cellBorder];
      const occupiedNeighbor = HashMap.get(cache.reversedField, neighborCoords);
      if (Option.isSome(occupiedNeighbor)) {
        const neighbor = this.getFor(occupiedNeighbor.value, {
          cellCache: cache.cellCache,
          reversedField: cache.reversedField,
        });

        Cell.match(cell, {
          Empty: (emptyCell) => {
            emptyCell.neighbors[cellBorder] = Option.some(neighbor);
          },
          Occupied: (occupiedCell) => {
            occupiedCell.neighbors[cellBorder] = neighbor;
          },
        });
        neighbor.neighbors[CellBorder.opposite(cellBorder)] = cell;
        return;
      }

      const cellNeighbor = cache.cellCache.get(neighborCoords.toString());
      if (cellNeighbor) {
        const neighbor = this.getFor(cellNeighbor, {
          cellCache: cache.cellCache,
          reversedField: cache.reversedField,
        });

        Cell.match(cell, {
          Empty: (x) => {
            x.neighbors[cellBorder] = Option.some(neighbor);
          },
          Occupied: (x) => {
            x.neighbors[cellBorder] = neighbor;
          },
        });
        Cell.match(neighbor, {
          Empty: (x) => {
            x.neighbors[CellBorder.opposite(cellBorder)] = Option.some(cell);
          },
          Occupied: (x) => {
            x.neighbors[CellBorder.opposite(cellBorder)] = cell;
          },
        });
        return;
      }

      Cell.match(cell, {
        Empty: () => undefined,
        Occupied: (x) => {
          const neighbor = this.getFor(Cell.Empty.Detached(neighborCoords), {
            cellCache: cache.cellCache,
            reversedField: cache.reversedField,
          });

          x.neighbors[cellBorder] = neighbor;
          neighbor.neighbors[CellBorder.opposite(cellBorder)] = Option.some(x);
        },
      });
    });

    return cell;
  }

  #coordsCell: CoordsCell | null = null;

  get coordsCell(): CoordsCell {
    if (this.#coordsCell) {
      return this.#coordsCell;
    }

    const result: CoordsCell = pipe(
      Cell.reduceWithFilter(
        this.graph,
        {
          white: MutableHashMap.empty<Coords.Coords, Cell.Occupied>(),
          black: MutableHashMap.empty<Coords.Coords, Cell.Occupied>(),
        },
        Cell.refine("Occupied"),
        (result, occupied) => {
          MutableHashMap.set(
            result[Cell.side(occupied)],
            occupied.coords,
            occupied
          );
          return result;
        }
      ),
      (x) => ({
        black: HashMap.fromIterable(x.black),
        white: HashMap.fromIterable(x.white),
      })
    );

    return (this.#coordsCell = result);
  }

  #graph: Cell.Cell | null = null;

  get graph(): Cell.Cell {
    if (this.#graph) {
      return this.#graph;
    }
    const _field = HashMap.map(this.field, (member, coords) =>
      Cell.Occupied.Detached({ member, coords })
    );
    const cellCache = new Map<string, Cell.Cell>();
    const first = HashMap.findFirst(this.field, () => true);

    const result = Option.isNone(first)
      ? Cell.Empty.Detached(Coords.Coords.Zero)
      : this.getFor(
          Cell.Occupied.Detached({
            member: first.value[1],
            coords: first.value[0],
          }),
          {
            cellCache,
            reversedField: _field,
          }
        );

    return (this.#graph = result);
  }

  get graphStats() {
    return Cell.reduce(
      this.graph,
      {
        connections: {
          empty: { empty: 0, occupied: 0 },
          occupied: { empty: 0, occupied: 0 },
        },
        empty: 0,
        occupied: 0,
      },
      (stats, cell) =>
        Cell.match(cell, {
          Empty: (empty) => {
            stats.empty++;
            pipe(
              Array.getSomes(empty.neighbors),
              Array.map(
                Cell.match({
                  Empty: () => stats.connections.empty.empty++,
                  Occupied: () => stats.connections.empty.occupied++,
                })
              )
            );
            return stats;
          },
          Occupied: (occupied) => {
            stats.occupied++;
            Array.map(
              occupied.neighbors,
              Cell.match({
                Empty: () => stats.connections.occupied.empty++,
                Occupied: () => stats.connections.occupied.occupied++,
              })
            );
            return stats;
          },
        })
    );
  }
}

export const getQueenBee: {
  (
    side: Side.Side
  ): (swarm: Swarm) => Option.Option<Cell.Occupied<Bug.QueenBee>>;
  (swarm: Swarm, Side: Side.Side): Option.Option<Cell.Occupied<Bug.QueenBee>>;
} = dual(2, (swarm: Swarm, side: Side.Side) =>
  Cell.findFirstMap(
    swarm.graph,
    pipe(
      Cell.refine("Occupied"),
      Predicate.compose(Cell.withBugInBasis(Bug.QueenBee.Init(side))),
      (x) => Option.liftPredicate(x)
    )
  )
);

export const getSurroundedQueenBee: {
  (
    side: Side.Side
  ): (swarm: Swarm) => Option.Option<Cell.Occupied<Bug.QueenBee>>;
  (swarm: Swarm, Side: Side.Side): Option.Option<Cell.Occupied<Bug.QueenBee>>;
} = dual(2, (swarm: Swarm, side: Side.Side) =>
  getQueenBee(swarm, side).pipe(
    Option.filter(Cell.isSurroundedWithOccupiedCells)
  )
);

export const queenBeesState = (swarm: Swarm) => {
  const whiteSurroundedQueenBee = getSurroundedQueenBee(swarm, "white");
  const blackSurroundedQueenBee = getSurroundedQueenBee(swarm, "black");

  return Match.value(
    distributive([whiteSurroundedQueenBee, blackSurroundedQueenBee])
  ).pipe(
    Match.when([Option.isSome, Option.isSome], ([white, black]) =>
      QueenBeeState.BothSurrounded({ cells: [white.value, black.value] })
    ),
    Match.when([Option.isNone, Option.isSome], ([_white, black]) =>
      QueenBeeState.OneSurrounded({ cell: black.value })
    ),
    Match.when([Option.isSome, Option.isNone], ([white, _black]) =>
      QueenBeeState.OneSurrounded({ cell: white.value })
    ),
    Match.when([Option.isNone, Option.isNone], ([_white, _black]) =>
      QueenBeeState.Free()
    ),
    Match.exhaustive
  );
};

export const Init = (bug: Bug.Bug) =>
  unsafeIntroduce(
    new Swarm({
      field: HashMap.empty(),
      lastMoved: bug,
      lastMovedByPillbug: false,
    }),
    bug,
    Coords.Coords.Zero
  );

const unsafeIntroduce: {
  (swarm: Swarm, bug: Bug.Bug, coords: Coords.Coords): Swarm;
  (bug: Bug.Bug, coords: Coords.Coords): (swarm: Swarm) => Swarm;
} = dual(
  3,
  (swarm: Swarm, bug: Bug.Bug, coords: Coords.Coords): Swarm =>
    new Swarm({
      field: HashMap.set(swarm.field, coords, SwarmMember.Init(bug)),
      lastMoved: bug,
      lastMovedByPillbug: false,
    })
);

export const occupiedCount = (swarm: Swarm) => HashMap.size(swarm.field);

export const bugs = (swarm: Swarm) =>
  pipe(
    HashMap.entries(swarm.field),
    Iterable.reduce(
      {
        white: [] as Array<Bug.Bug>,
        black: [] as Array<Bug.Bug>,
      },
      (acc, [_coords, swarmMember]) => {
        acc[swarmMember.bug.side].push(swarmMember.bug);
        swarmMember.cover.forEach((bug) => acc[bug.side].push(bug));

        return acc;
      }
    )
  );

const slideableNeighborsEmptyCellsStep = (
  from: HashSet.HashSet<Cell.Occupied>,
  prev: HashSet.HashSet<Coords.Coords> = HashSet.empty()
): HashMap.HashMap<Coords.Coords /* empty cell coords */, Cell.Occupied> => {
  return pipe(
    HashSet.toValues(from),
    Array.map((fromCell) => ({
      fromCell,
      toCells: Cell.slideableNeighborsEmptyCells(fromCell),
    })),
    // HashSet.flatMap(Cell.slideableNeighborsEmptyCells),
    // HashSet.difference(prev),
    // HashSet.toValues,
    Array.flatMap((x) => {
      const newSwarmClone = Cell.toField(x.fromCell).pipe(
        HashMap.remove(x.fromCell.coords)
      );

      return pipe(
        HashSet.toValues(x.toCells),
        Array.map((toCell) => {
          const newSwarm = new Swarm({
            field: HashMap.set(newSwarmClone, toCell.coords, x.fromCell.member),
            lastMoved: x.fromCell.member.bug,
            lastMovedByPillbug: false,
          });

          const cellInNewSwarm = Cell.findFirstOccupied(newSwarm.graph, (x) =>
            Equal.equals(x.coords, toCell.coords)
          );

          if (Option.isNone(cellInNewSwarm)) {
            throw new Error("slideableNeighborsEmptyCellsStep");
          }

          return {
            toEmptyCellCoords: toCell.coords,
            cellInNewSwarm,
          };
        })
      );
    }),
    (x) =>
      HashMap.make(
        ...x.map((s) => [s.toEmptyCellCoords, s.cellInNewSwarm.value] as const)
      ),
    HashMap.removeMany(prev)
  );
};

const movingStrategies: Record<
  Bug.Bug["_tag"],
  (from: Cell.Occupied, level: number) => HashSet.HashSet<Cell.Cell>
> = {
  Ant: (from) => {
    let result = HashSet.make(from.coords);
    let next = HashSet.make(from);

    while (HashSet.size(next) !== 0) {
      const stepResult = slideableNeighborsEmptyCellsStep(next, result);

      next = HashSet.make(...HashMap.values(stepResult));

      const emptyCells = HashMap.keySet(stepResult).pipe(
        HashSet.map((emptyCoords) => {
          const emptyCellWithCoords = Cell.findFirstEmpty(from, (emptyCell) =>
            Equal.equals(emptyCoords, emptyCell.coords)
          );

          if (Option.isNone(emptyCellWithCoords)) {
            throw new Error("movesStrategies.Ant");
          }
          return emptyCellWithCoords.value.coords;
        })
      );

      result = HashSet.union(result, emptyCells);
    }

    return HashSet.remove(result, from.coords).pipe(
      HashSet.map(
        (coord) =>
          [
            coord,
            Cell.findFirstEmpty(from, (x) => Equal.equals(x.coords, coord)),
          ] as const
      ),
      HashSet.map(([_, x]) => {
        if (Option.isNone(x)) {
          throw new Error("movesStrategies.Ant222");
        }
        return x.value;
      })
    );
  },
  Beetle: (from, level) => {
    if (level === 0) {
      return HashSet.fromIterable(
        Array.filter(from.neighbors, Cell.refine("Occupied"))
      ).pipe(
        HashSet.intersection(
          Cell.beetleMovingNeighbors({ from, level, strategy: "climb" })
        ),
        HashSet.union<Cell.Cell>(Cell.slideableNeighborsEmptyCells(from))
      );
    } else {
      return Cell.beetleMovingNeighbors({ from, level, strategy: "pass" });
    }
  },
  Ladybug: (from, level) =>
    HashSet.fromIterable(
      Array.filter(from.neighbors, Cell.refine("Occupied"))
    ).pipe(
      HashSet.intersection(
        Cell.beetleMovingNeighbors({ from, level, strategy: "climb" })
      ),
      HashSet.flatMap((x) =>
        pipe(
          Array.filter(x.neighbors, Cell.refine("Occupied")),
          Array.intersection(
            Cell.beetleMovingNeighbors({
              from: x,
              level: level + 1,
              strategy: "pass",
            })
          )
        )
      ),
      HashSet.difference(HashSet.make(from)),
      HashSet.flatMap((x) =>
        pipe(
          Array.filter(x.neighbors, Cell.refine("Empty")),
          Array.intersection(
            Cell.beetleMovingNeighbors({
              from: x,
              level: level + 1,
              strategy: "pass",
            })
          )
        )
      )
    ),
  Mosquito: (from, level) => {
    if (level !== 0) {
      return movingStrategies["Beetle"](from, level);
    }
    return HashSet.fromIterable(from.neighbors).pipe(
      HashSet.filter(Cell.refine("Occupied")),
      HashSet.filter((x) => !Bug.refine("Mosquito")(Cell.masterBug(x))),
      HashSet.flatMap((x) =>
        movingStrategies[Cell.masterBug(x)._tag](from, level)
      )
    );
  },
  Grasshopper: (from) =>
    pipe(
      Cell.bordersWithNeighborsOccupied(from),
      Array.map(getEmptyByDiagonal(from)),
      HashSet.fromIterable
    ),
  Pillbug: (from) => Cell.slideableNeighborsEmptyCells(from),
  QueenBee: (from) => Cell.slideableNeighborsEmptyCells(from),
  Spider: (from) => {
    // copied from Ant
    let result = HashSet.make(from.coords);
    let next = HashSet.make(from);
    let i = 0;

    let finalResult = HashSet.empty<Coords.Coords>();

    while (i++ !== 3) {
      const stepResult = slideableNeighborsEmptyCellsStep(next, result);

      next = HashSet.make(...HashMap.values(stepResult));

      finalResult = HashMap.keySet(stepResult).pipe(
        HashSet.map((emptyCoords) => {
          const emptyCellWithCoords = Cell.findFirstEmpty(from, (emptyCell) =>
            Equal.equals(emptyCoords, emptyCell.coords)
          );

          if (Option.isNone(emptyCellWithCoords)) {
            throw new Error("movesStrategies.Ant");
          }
          return emptyCellWithCoords.value.coords;
        })
      );

      result = HashSet.union(result, finalResult);
    }

    return HashSet.remove(finalResult, from.coords).pipe(
      HashSet.map(
        (coord) =>
          [
            coord,
            Cell.findFirstEmpty(from, (x) => Equal.equals(x.coords, coord)),
          ] as const
      ),
      HashSet.map(([_, x]) => {
        if (Option.isNone(x)) {
          throw new Error("movesStrategies.Ant222");
        }
        return x.value;
      })
    );
  },
};

export const getMovementCellsFor: {
  (bug: Bug.Bug): (swarm: Swarm) => Option.Option<HashSet.HashSet<Cell.Cell>>;
  (swarm: Swarm, bug: Bug.Bug): Option.Option<HashSet.HashSet<Cell.Cell>>;
} = dual(2, (swarm: Swarm, bug: Bug.Bug) =>
  pipe(
    Cell.findFirstOccupiedMap(swarm.graph, (occupied) =>
      Cell.hasBug(occupied, bug).pipe(
        Option.map((level) => ({
          level,
          occupied,
        }))
      )
    ),
    Option.map(({ level, occupied }) =>
      movingStrategies[bug._tag](occupied, level)
    )
  )
);

export const pillbugAbilityMovingCells: {
  (
    side: Side.Side,
    bug: Bug.Bug
  ): (
    swarm: Swarm
  ) => Either.Either<HashSet.HashSet<Cell.Empty>, SwarmError.SwarmError>;
  (
    swarm: Swarm,
    side: Side.Side,
    bug: Bug.Bug
  ): Either.Either<HashSet.HashSet<Cell.Empty>, SwarmError.SwarmError>;
} = dual(
  3,
  (
    swarm: Swarm,
    side: Side.Side,
    bug: Bug.Bug
  ): Either.Either<HashSet.HashSet<Cell.Empty>, SwarmError.BugNotFound> =>
    Either.gen(function* () {
      //TODO add // Cell.climbableNeighbors(from, level)
      const fromCell = yield* Cell.findFirstOccupied(
        swarm.graph,
        Cell.withBugInBasis(bug)
      ).pipe(Either.fromOption(() => new SwarmError.BugNotFound({ bug })));

      if (Cell.isWithCover(fromCell)) {
        return HashSet.empty();
      }

      const occupiedNeighbors = Array.map(
        Cell.neighborsOccupied(fromCell),
        (x) => x.occupied
      );

      const climbableCells = Cell.beetleMovingNeighbors({
        from: fromCell,
        level: 0,
        strategy: "climb",
      });

      const pillbugNeighbors = pipe(
        occupiedNeighbors,
        Array.filter((x) => Cell.refineBugInBasis(x, Bug.refine("Pillbug"))),
        Array.filter((x) => !Cell.isWithCover(x) && x.member.bug.side === side)
      );

      const mosquotoNeighbors = pipe(
        occupiedNeighbors,
        Array.filter(Cell.refineBugInBasis(Bug.refine("Mosquito"))),
        Array.filter(
          (x) =>
            !Cell.isWithCover(x) &&
            x.member.bug.side === side &&
            Array.some(Cell.neighborsOccupied(x), (x) => {
              return (
                !Cell.isWithCover(x.occupied) &&
                Cell.refineBugInBasis(x.occupied, Bug.refine("Pillbug"))
              );
            })
        )
      );

      return pipe(
        Array.prependAll(pillbugNeighbors, mosquotoNeighbors),
        Array.filter((x) => HashSet.has(climbableCells, x)),
        Array.filter((x) => {
          if (Equal.equals(swarm.lastMoved, x.member.bug)) {
            return !swarm.lastMovedByPillbug;
          } else {
            return true;
          }
        }),
        Array.flatMap((pillbugOrMosquito) => {
          const passableCells = Cell.beetleMovingNeighbors({
            from: pillbugOrMosquito,
            level: 1,
            strategy: "pass",
          });
          return pipe(
            pillbugOrMosquito.neighbors,

            Array.filter((x) => HashSet.has(passableCells, x)),
            Array.filter(Cell.refine("Empty"))
          );
        }),
        HashSet.fromIterable
      );
    })
);

export const move: {
  (
    move: GameMove.BugGameMove
  ): (swarm: Swarm) => Either.Either<Swarm, SwarmError.SwarmError>;
  (
    swarm: Swarm,
    move: GameMove.BugGameMove
  ): Either.Either<Swarm, SwarmError.SwarmError>;
} = dual(
  2,
  (
    swarm: Swarm,
    move: GameMove.BugGameMove
  ): Either.Either<Swarm, SwarmError.SwarmError> =>
    Either.gen(function* () {
      const targetCell = yield* findTargetMovingCell(swarm, move);
      const fromCell = Cell.findFirstOccupied(swarm.graph, (x) =>
        Cell.hasBug(x, move.bug).pipe(Option.isSome)
      );

      if (Option.isNone(fromCell)) {
        // introduction
        return yield* Cell.match(targetCell, {
          Empty: (cell) => {
            const isOnlyNeighborsWithMoveSide = pipe(
              Cell.neighborsOccupied(cell),
              Array.every((x) => Cell.side(x.occupied) === GameMove.side(move))
            );

            if (isOnlyNeighborsWithMoveSide || occupiedCount(swarm) === 1) {
              return Either.right(
                unsafeIntroduce(swarm, move.bug, cell.coords)
              );
            } else {
              return Either.left(
                new SwarmError.IntroductionMoveViolation({ move })
              );
            }
          },
          Occupied: () =>
            Either.left(new SwarmError.IntroductionMoveViolation({ move })),
        });
      }

      const queenBeeFromSwarm = getQueenBee(swarm, GameMove.side(move));
      if (Option.isNone(queenBeeFromSwarm)) {
        // ходить только если королева размещена
        return yield* Either.left(
          new SwarmError.MoveBeforeQueenBeePlacementViolation({ move })
        );
      }

      // moving move
      const underPressure = yield* Cell.isBugUnderPressure(
        fromCell.value,
        move.bug
      ).pipe(
        Either.fromOption(() => new SwarmError.BugNotFound({ bug: move.bug }))
      );
      if (underPressure) {
        return yield* Either.left(new SwarmError.BeetlePressure({ move }));
      }

      if (swarm.lastMovedByPillbug && Equal.equals(move.bug, swarm.lastMoved)) {
        return yield* Either.left(
          new SwarmError.LastMovedByPillbugViolation({
            move,
          })
        );
      }

      const validatedSwarm = yield* validateSplit(swarm, fromCell.value);

      let lastMovedByPillbug = false;
      if (move.bug.side === GameMove.side(move)) {
        const movementCells = yield* getMovementCellsFor(
          validatedSwarm,
          move.bug
        ).pipe(
          Either.fromOption(() => new SwarmError.BugNotFound({ bug: move.bug }))
        );

        if (!HashSet.has(movementCells, targetCell)) {
          lastMovedByPillbug = yield* isMovedByPillbug(
            validatedSwarm,
            move,
            targetCell
          );
        }
      } else {
        lastMovedByPillbug = yield* isMovedByPillbug(
          validatedSwarm,
          move,
          targetCell
        );
      }

      const [bug, newFromMember] = SwarmMember.popBug(fromCell.value.member);

      const fieldWithMovedBug = yield* Cell.match(targetCell, {
        Empty: (empty) =>
          Either.right(
            HashMap.set(
              validatedSwarm.field,
              empty.coords,
              SwarmMember.Init(bug)
            )
          ),
        Occupied: (occupied) => {
          if (bug._tag !== "Beetle") {
            return Either.left(new SwarmError.ImpossibleMove({ move }));
          }

          return Either.right(
            HashMap.set(
              validatedSwarm.field,
              occupied.coords,
              SwarmMember.addCover(occupied.member, bug)
            )
          );
        },
      });

      const newField = Option.match(newFromMember, {
        onNone: () => HashMap.remove(fieldWithMovedBug, fromCell.value.coords),
        onSome: (x) => HashMap.set(fieldWithMovedBug, fromCell.value.coords, x),
      });

      return new Swarm({
        field: newField,
        lastMoved: bug,
        lastMovedByPillbug,
      });
    })
);

export const findTargetMovingCell: {
  (
    move: GameMove.BugGameMove
  ): (swarm: Swarm) => Either.Either<Cell.Cell, SwarmError.BugNotFound>;
  (
    swarm: Swarm,
    move: GameMove.BugGameMove
  ): Either.Either<Cell.Cell, SwarmError.BugNotFound>;
} = dual(2, (swarm: Swarm, move: GameMove.BugGameMove) =>
  pipe(
    Cell.findFirstOccupiedMap(swarm.graph, (cell) =>
      Cell.withBugInBasis(cell, move.neighbor)
        ? Option.some(cell.neighbors[move.cellBorder])
        : Option.none()
    ),
    Either.fromOption(() => new SwarmError.BugNotFound({ bug: move.neighbor }))
  )
);

export const getEmptyByDiagonal =
  (from: Cell.Cell) =>
  (border: CellBorder.CellBorder): Cell.Empty =>
    Cell.match(from, {
      Empty: (x) => x,
      Occupied: (x) => getEmptyByDiagonal(x.neighbors[border])(border),
    });

export const validateSplit: {
  (
    swarm: Swarm,
    cell: Cell.Occupied
  ): Either.Either<Swarm, SwarmError.SplitSwarm>;
  (
    cell: Cell.Occupied
  ): (swarm: Swarm) => Either.Either<Swarm, SwarmError.SplitSwarm>;
} = dual(
  2,
  (
    swarm: Swarm,
    cell: Cell.Occupied
  ): Either.Either<Swarm, SwarmError.SplitSwarm> => {
    const occupiedNeighbor = Array.findFirst(
      cell.neighbors,
      Cell.refine("Occupied")
    );
    if (Option.isNone(occupiedNeighbor)) {
      return Either.left(
        new SwarmError.SplitSwarm({
          cell,
        })
      );
    }
    const connectedOccupiedWithoutCell = Cell.reduceWithFilter(
      occupiedNeighbor.value,
      0,
      Predicate.compose(Cell.refine("Occupied"), (x) => !Equal.equals(x, cell)),
      (acc) => acc + 1
    );

    if (
      occupiedCount(swarm) !==
      connectedOccupiedWithoutCell + 1 /*cell itself*/
    ) {
      return Either.left(new SwarmError.SplitSwarm({ cell }));
    } else {
      return Either.right(swarm);
    }
  }
);

/**
 * Возвращает координаты каждой ячейки
 */
export function getCoordsMap(cell: Cell.Cell) {
  return Cell.reduce<Map<Cell.Cell, Coords.Coords>>(
    cell,
    new Map([[cell, Coords.Coords.Zero]]),
    (acc, cell) => {
      const cellCoords = acc.get(cell);
      if (!cellCoords) {
        throw new Error("getCoordsMap acc.get");
      }

      const writeCellCoords = (
        cell: Cell.Cell,
        neighborIndex: CellBorder.CellBorder
      ) => acc.set(cell, Coords.Coords.Neighbor(cellCoords, neighborIndex));

      cell.neighbors.forEach((neighbor, neighborIndex) => {
        if (Option.isOption(neighbor)) {
          if (Option.isNone(neighbor)) {
            return;
          }
          return writeCellCoords(
            neighbor.value,
            neighborIndex as CellBorder.CellBorder
          );
        }

        return writeCellCoords(
          neighbor,
          neighborIndex as CellBorder.CellBorder
        );
      });

      return acc;
    }
  );
}

const underline = "\u0332";
export function toString(
  swarm: Swarm,
  options?: {
    target?: Cell.Cell | undefined;
    highlight?: HashSet.HashSet<Cell.Cell> | undefined;
  }
) {
  const map = getCoordsMap(swarm.graph);
  const field: Array<Array<Cell.Cell | undefined>> = [];
  let minX = 0;
  let minY = 0;

  for (const [, coords] of map) {
    minX = Math.min(minX, coords.x * 2);
    minY = Math.min(minY, coords.y);
  }
  minX *= -1;
  minY *= -1;

  for (const [cell, coords] of map) {
    const row = field[minY + coords.y] ?? (field[minY + coords.y] = []);
    row[coords.x * 2 + minX] = cell;
  }

  return (
    field
      .map((row) =>
        [...row].map((cell) => {
          if (cell === undefined) {
            return "   ";
          } else {
            const isZero = Equal.equals(cell.coords, Coords.Coords.Zero);
            const isTarget = options?.target
              ? Equal.equals(options.target, cell)
              : false;

            const left = () =>
              isZero ? "(" + (isTarget ? underline : "") : isTarget ? "_" : " ";
            const right = (override?: string) => {
              if (isZero) {
                if (isTarget) {
                  return (override ? override : ")") + underline;
                }
                return override ? override : ")";
              } else {
                if (isTarget) {
                  return override ? override + underline : "_";
                }
                return override ? override : " ";
              }
            };

            return Cell.match(cell, {
              Empty: (emptyCell) =>
                options?.highlight && HashSet.has(options.highlight, emptyCell)
                  ? `${left()}×${right()}`
                  : `${left()}○${right()}`,
              Occupied: (x) =>
                `${left()}${Bug.symbol(x.member.bug)}${right(
                  options?.highlight
                    ? HashSet.has(options.highlight, x)
                      ? "×"
                      : undefined
                    : undefined
                )}` +
                (x.member.cover.length === 0
                  ? ""
                  : x.member.cover.map(Bug.symbol).join("")), //BugDto.encodeSync(x.member.bug),
            });
          }
        })
      )
      // .toReversed()
      .map((x) => x.join(""))
      .toReversed()
      .join("\n\n")
  );
}

export const hasIntroducibleCells = (side: Side.Side) => (swarm: Swarm) =>
  Cell.reduce(swarm.graph, false, (res, cell) =>
    Cell.match(cell, {
      Empty: () => res,
      Occupied: (occupied) =>
        res ||
        Array.some(CellBorder.CellBorders, (cellBorder) =>
          Cell.match(occupied.neighbors[cellBorder], {
            Empty: (emptyNeighbor) =>
              /* has oppositeColor neighbor*/ pipe(
                Cell.neighborsOccupied(emptyNeighbor),
                Array.every((x) => Cell.side(x.occupied) === side)
              ),
            Occupied: () => false,
          })
        ),
    })
  );

export const possibleMoves = (side: Side.Side) => (swarm: Swarm) => {
  const pillbugAbilityMoves = HashMap.union(
    swarm.coordsCell[side],
    swarm.coordsCell[Side.opposite(side)]
  ).pipe(
    HashMap.values,
    HashSet.fromIterable,
    HashSet.flatMap((x) => {
      const bug = Cell.masterBug(x);
      return pillbugAbilityMovingCells(swarm, side, bug).pipe(
        Option.getRight,
        Option.map(
          HashSet.flatMap((ss) =>
            pipe(
              Cell.neighborsOccupied(ss),
              Array.head,
              Option.map((x) =>
                HashSet.make(
                  new GameMove.BugGameMove({
                    side,
                    bug,
                    cellBorder: x.border,
                    neighbor: Cell.masterBug(x.occupied),
                  })
                )
              ),
              Option.getOrElse(() => HashSet.empty<GameMove.BugGameMove>())
            )
          )
        ),
        Option.getOrElse(() => HashSet.empty<GameMove.BugGameMove>())
      );
    })
  );

  return swarm.coordsCell[side].pipe(
    HashMap.values,
    HashSet.fromIterable,
    HashSet.flatMap((x) => {
      const bug = Cell.masterBug(x);

      return getMovementCellsFor(swarm, bug).pipe(
        Option.map((x) =>
          HashSet.map(x, (ss) =>
            pipe(
              Cell.neighborsOccupied(ss),
              Array.head,
              Option.map(
                (x) =>
                  new GameMove.BugGameMove({
                    side,
                    bug,
                    cellBorder: x.border,
                    neighbor: Cell.masterBug(x.occupied),
                  })
              )
            )
          ).pipe(
            HashSet.filter(Option.isSome),
            HashSet.map((x) => x.value)
          )
        ),
        Option.getOrElse(() => HashSet.empty<GameMove.BugGameMove>())
      );
    }),
    HashSet.map((x) => move(swarm, x).pipe(Either.map(() => x))),
    HashSet.filter(Either.isRight),
    HashSet.map((x) => x.right),
    HashSet.union(pillbugAbilityMoves)
  );
};

const isMovedByPillbug = (
  swarm: Swarm,
  move: GameMove.BugGameMove,
  targetCell: Cell.Cell
) =>
  Either.gen(function* () {
    const pillBugAbilityMovingCells = yield* pillbugAbilityMovingCells(
      swarm,
      GameMove.side(move),
      move.bug
    );

    if (!HashSet.has(pillBugAbilityMovingCells, targetCell)) {
      return yield* Either.left(new SwarmError.ImpossibleMove({ move }));
    }
    return true as const;
  });

export const findCellWithBug = (swarm: Swarm, bug: Bug.Bug) =>
  Cell.findFirstOccupied(swarm.graph, (x) => Equal.equals(x.member.bug, bug));
