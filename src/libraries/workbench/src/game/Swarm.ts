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
} from "effect";
import * as Cell from "./Cell.ts";
import type { Side } from "./Side.ts";
import * as CellBorder from "./CellBorder.ts";
import * as Coords from "./Coords.ts";
import * as Bug from "./Bug.ts";
import * as SwarmMember from "./SwarmMember.ts";
import { absurd, dual, hole } from "effect/Function";
import { distributive } from "../shared/effect/Types.ts";
import { QueenBeeState } from "./QueenBeeState.ts";
import * as SwarmError from "./SwarmError.ts";
import * as Move from "./Move.ts";

export interface Swarm extends Pipeable.Pipeable {}
export class Swarm extends Data.Class<{
  field: HashMap.HashMap<Coords.Coords, SwarmMember.SwarmMember>;
}> {
  static {
    this.prototype.pipe = function () {
      return Pipeable.pipeArguments(this, arguments);
    };
  }

  private getFor<C extends Cell.Cell>(
    cell: C,
    cache: {
      reversedField: HashMap.HashMap<Coords.Coords, Cell.Occupied<Bug.Bug>>;
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

        Cell.Cell.$match(cell, {
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

        Cell.Cell.$match(cell, {
          Empty: (x) => {
            x.neighbors[cellBorder] = Option.some(neighbor);
          },
          Occupied: (x) => {
            x.neighbors[cellBorder] = neighbor;
          },
        });
        Cell.Cell.$match(neighbor, {
          Empty: (x) => {
            x.neighbors[CellBorder.opposite(cellBorder)] = Option.some(cell);
          },
          Occupied: (x) => {
            x.neighbors[CellBorder.opposite(cellBorder)] = cell;
          },
        });
        return;
      }

      Cell.Cell.$match(cell, {
        Empty: () => {},
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

  #graph: null | Cell.Cell = null;

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
        Cell.Cell.$match(cell, {
          Empty: (empty) => {
            stats.empty++;
            pipe(
              Array.getSomes(empty.neighbors),
              Array.map(
                Cell.Cell.$match({
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
              Cell.Cell.$match({
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
  (side: Side): (swarm: Swarm) => Option.Option<Cell.Occupied<Bug.QueenBee>>;
  (swarm: Swarm, Side: Side): Option.Option<Cell.Occupied<Bug.QueenBee>>;
} = dual(2, (swarm: Swarm, side: Side) =>
  Cell.findFirstMap(
    swarm.graph,
    pipe(
      Cell.Cell.$is("Occupied"),
      Predicate.compose(Cell.withBugInBasis(Bug.QueenBee.Init(side))),
      (x) => Option.liftPredicate(x)
    )
  )
);

export const getSurroundedQueenBee: {
  (side: Side): (swarm: Swarm) => Option.Option<Cell.Occupied<Bug.QueenBee>>;
  (swarm: Swarm, Side: Side): Option.Option<Cell.Occupied<Bug.QueenBee>>;
} = dual(2, (swarm: Swarm, side: Side) =>
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

export const Empty = () => new Swarm({ field: HashMap.empty() });
export const Init = (bug: Bug.Bug) =>
  unsafeIntroduce(Empty(), bug, Coords.Coords.Zero);

const unsafeIntroduce: {
  (swarm: Swarm, bug: Bug.Bug, coords: Coords.Coords): Swarm;
  (bug: Bug.Bug, coords: Coords.Coords): (swarm: Swarm) => Swarm;
} = dual(
  3,
  (swarm: Swarm, bug: Bug.Bug, coords: Coords.Coords): Swarm =>
    new Swarm({
      field: HashMap.set(swarm.field, coords, SwarmMember.Init(bug)),
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
        swarmMember.beetles.forEach((bug) => acc[bug.side].push(bug));

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

const movesStrategies = {
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
  Beetle: (from) =>
    HashSet.union<Cell.Cell>(
      Cell.slideableNeighborsEmptyCells(from),
      HashSet.fromIterable(
        Array.filter(from.neighbors, Cell.Cell.$is("Occupied"))
      )
    ),
  Grasshopper: (from) =>
    pipe(
      Cell.bordersWithNeighborsOccupied(from),
      Array.map(getEmptyByDiagonal(from)),
      HashSet.fromIterable
    ),
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
} as const satisfies Record<
  Bug.Bug["_tag"],
  (from: Cell.Occupied) => HashSet.HashSet<Cell.Cell>
>;

export const getMovementCellsFor: {
  <B extends Bug.Bug>(
    bug: B
  ): (swarm: Swarm) => Option.Option<HashSet.HashSet<Cell.Cell>>;
  <B extends Bug.Bug>(
    swarm: Swarm,
    bug: B
  ): Option.Option<HashSet.HashSet<Cell.Cell>>;
} = dual(2, <B extends Bug.Bug>(swarm: Swarm, bug: B) =>
  pipe(
    Cell.findFirstMap(
      swarm.graph,
      Cell.Cell.$match({
        Empty: () => Option.none(),
        Occupied: Option.liftPredicate(Cell.hasBug(bug)),
      })
    ),
    (x) => x,
    Option.map(movesStrategies[bug._tag])
  )
);

export const move: {
  (
    move: Move.MovingMove
  ): (swarm: Swarm) => Either.Either<Swarm, SwarmError.SwarmError>;
  (
    swarm: Swarm,
    move: Move.MovingMove
  ): Either.Either<Swarm, SwarmError.SwarmError>;
} = dual(
  2,
  (
    swarm: Swarm,
    move: Move.MovingMove
  ): Either.Either<Swarm, SwarmError.SwarmError> =>
    Either.gen(function* () {
      const targetCell = yield* findTargetMovingCell(swarm, move);
      const fromCell = Cell.findFirstOccupied(
        swarm.graph,
        Cell.hasBug(move.bug)
      );

      if (Option.isNone(fromCell)) {
        // introduction
        return yield* Cell.Cell.$match(targetCell, {
          Empty: (cell) => {
            const isOnlyNeighborsWithMoveSide = pipe(
              Cell.neighborsOccupied(cell),
              Array.every((x) => Cell.side(x.occupied) === Move.side(move))
            );

            if (isOnlyNeighborsWithMoveSide) {
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

      const queenBeeFromSwarm = getQueenBee(swarm, Move.side(move));
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

      const validatedSwarm = yield* validateSplit(swarm, fromCell.value);
      const movementCells = yield* getMovementCellsFor(
        validatedSwarm,
        move.bug
      ).pipe(
        Either.fromOption(() => new SwarmError.BugNotFound({ bug: move.bug }))
      );

      if (!HashSet.has(movementCells, targetCell)) {
        return yield* Either.left(new SwarmError.ImpossibleMove({ move }));
      }

      const [bug, newFromMember] = SwarmMember.popBug(fromCell.value.member);

      const fieldWithMovedBug = yield* Cell.Cell.$match(targetCell, {
        Empty: (x) =>
          Either.right(
            HashMap.set(validatedSwarm.field, x.coords, SwarmMember.Init(bug))
          ),
        Occupied: (x) => {
          if (bug._tag !== "Beetle") {
            return Either.left(new SwarmError.ImpossibleMove({ move }));
          }

          return Either.right(
            HashMap.set(
              validatedSwarm.field,
              x.coords,
              SwarmMember.addBeetle(x.member, bug)
            )
          );
        },
      });
      const newField = Option.match(newFromMember, {
        onNone: () => HashMap.remove(fieldWithMovedBug, fromCell.value.coords),
        onSome: (x) => HashMap.set(fieldWithMovedBug, fromCell.value.coords, x),
      });

      return new Swarm({ field: newField });
    })
);

export const findTargetMovingCell: {
  (
    move: Move.MovingMove
  ): (swarm: Swarm) => Either.Either<Cell.Cell, SwarmError.BugNotFound>;
  (
    swarm: Swarm,
    move: Move.MovingMove
  ): Either.Either<Cell.Cell, SwarmError.BugNotFound>;
} = dual(2, (swarm: Swarm, move: Move.MovingMove) =>
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
    Cell.Cell.$match(from, {
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
      Cell.Cell.$is("Occupied")
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
      Predicate.compose(
        Cell.Cell.$is("Occupied"),
        (x) => !Equal.equals(x, cell)
      ),
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
  options?:
    | {
        target?: Cell.Cell | undefined;
        highlight?: HashSet.HashSet<Cell.Cell> | undefined;
      }
    | undefined
) {
  const map = getCoordsMap(swarm.graph);
  const field: Array<Array<Cell.Cell | undefined>> = [];
  let minX = 0;
  let minY = 0;

  for (const [_cell, coords] of map) {
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
        [...row].map((cell, i) => {
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

            return Cell.Cell.$match(cell, {
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
                )}`, //BugDto.encodeSync(x.member.bug),
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

export const hasIntroducableCells = (side: Side) => (swarm: Swarm) =>
  Cell.reduce(swarm.graph, false, (res, cell) =>
    Cell.Cell.$match(cell, {
      Empty: () => res,
      Occupied: (occupied) =>
        res ||
        Array.some(CellBorder.CellBorders, (cellBorder) =>
          Cell.Cell.$match(occupied.neighbors[cellBorder], {
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

export const hasMovableSwarmMembers = (side: Side) => (swarm: Swarm) => {
  // return reduce(swarm.graph, false, (res, cell) => {
  //   return Cell.Cell.$match(cell, {
  //     Empty: () => res || false,
  //     Occupied: (occupied) => {
  //       Array.some(CellBorder.CellBorders, (cellBorder) => {
  //         return Cell.Cell.$match(occupied.neighbors[cellBorder], {
  //           Empty: (emptyNeighbor) => false,
  //           Occupied: () => false,
  //         });
  //       });
  //     },
  //   });
  // });
};
