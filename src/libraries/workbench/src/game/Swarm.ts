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
import { Side } from "./Side.ts";
import * as CellBorder from "./CellBorder.ts";
import * as Coords from "./Coords.ts";
import * as Bug from "./Bug.ts";
import * as SwarmMember from "./SwarmMember.ts";
import { dual } from "effect/Function";
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
  get reversedField() {
    return pipe(
      this.field,
      HashMap.toEntries,
      Array.map(Tuple.swap),
      HashMap.fromIterable
    );
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
    return reduce(
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
  findFirstMap(
    swarm,
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

export const queenBeeState = (swarm: Swarm) => {
  const whiteSurroundedQueenBee = getSurroundedQueenBee(swarm, Side.White);
  const blackSurroundedQueenBee = getSurroundedQueenBee(swarm, Side.Black);

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

export const reduceWithFilter = <B, C extends Cell.Cell>(
  startCell: Cell.Cell,
  b: B,
  filterPath: Predicate.Refinement<Cell.Cell, C>,
  f: (b: B, a: C) => B
): B => {
  let acc = b;
  const cellsToVisit = [startCell];
  const visitedCells = new Set();

  while (cellsToVisit.length) {
    const currentCell = cellsToVisit.pop();

    if (currentCell === undefined) {
      continue;
    }
    if (visitedCells.has(currentCell)) {
      continue;
    }
    if (!filterPath(currentCell)) {
      continue;
    }

    acc = f(acc, currentCell);

    Cell.Cell.$match(currentCell, {
      Occupied: (x) => cellsToVisit.push(...x.neighbors),
      Empty: (x) => cellsToVisit.push(...pipe(x.neighbors, Array.getSomes)),
    });

    visitedCells.add(currentCell);
  }

  return acc;
};

export const reduce = <B>(
  initialCell: Cell.Cell,
  b: B,
  f: (b: B, a: Cell.Cell) => B
): B => reduceWithFilter(initialCell, b, (x): x is Cell.Cell => true, f);

export const filter =
  (predicate: Predicate.Predicate<Cell.Cell>) => (swarm: Swarm) =>
    reduce<Array<Cell.Cell>>(swarm.graph, Array.empty(), (acc, cur) => {
      if (predicate(cur)) {
        acc.push(cur);
      }
      return acc;
    });

export const findFirst: {
  (
    predicate: (cell: Cell.Cell) => boolean
  ): (swarm: Swarm) => Option.Option<Cell.Cell>;
  (
    swarm: Swarm,
    predicate: (cell: Cell.Cell) => boolean
  ): Option.Option<Cell.Cell>;
} = dual(2, (swarm: Swarm, predicate: (cell: Cell.Cell) => boolean) => {
  const predicateOption = Option.liftPredicate(predicate);

  return reduce(swarm.graph, Option.none<Cell.Cell>(), (acc, cur) =>
    acc.pipe(Option.orElse(() => predicateOption(cur)))
  );
});

export const findFirstMap: {
  <A>(
    predicate: (cell: Cell.Cell) => Option.Option<A>
  ): (swarm: Swarm) => Option.Option<A>;
  <A>(
    swarm: Swarm,
    predicate: (cell: Cell.Cell) => Option.Option<A>
  ): Option.Option<A>;
} = dual(
  2,
  <A>(swarm: Swarm, predicate: (cell: Cell.Cell) => Option.Option<A>) =>
    reduce(swarm.graph, Option.none<A>(), (acc, cur) =>
      acc.pipe(Option.orElse(() => predicate(cur)))
    )
);

export const findFirstOccupiedMap: {
  <A>(
    predicate: (cell: Cell.Occupied) => Option.Option<A>
  ): (swarm: Swarm) => Option.Option<A>;
  <A>(
    swarm: Swarm,
    predicate: (cell: Cell.Occupied) => Option.Option<A>
  ): Option.Option<A>;
} = dual(
  2,
  <A>(swarm: Swarm, predicate: (cell: Cell.Occupied) => Option.Option<A>) =>
    findFirstMap(
      swarm,
      Cell.Cell.$match({
        Empty: () => Option.none(),
        Occupied: predicate,
      })
    )
);

export const findFirstOccupied: {
  (
    predicate: (cell: Cell.Occupied) => boolean
  ): (swarm: Swarm) => Option.Option<Cell.Cell>;
  (
    swarm: Swarm,
    predicate: (cell: Cell.Occupied) => boolean
  ): Option.Option<Cell.Occupied>;
} = dual(2, (swarm: Swarm, predicate: (cell: Cell.Occupied) => boolean) =>
  findFirstOccupiedMap(swarm, Option.liftPredicate(predicate))
);

export const occupiedCount = (swarm: Swarm) => HashMap.size(swarm.field);

export const bugs = (swarm: Swarm) =>
  pipe(
    HashMap.entries(swarm.field),
    Iterable.reduce(
      {
        [Side.White]: [] as Array<Bug.Bug>,
        [Side.Black]: [] as Array<Bug.Bug>,
      },
      (acc, [_coords, swarmMember]) => {
        acc[swarmMember.bug.side].push(swarmMember.bug);
        swarmMember.beetles.forEach((bug) => acc[bug.side].push(bug));

        return acc;
      }
    )
  );

const slideableNeighborsEmptyCellsStep = (
  from: HashSet.HashSet<Cell.Cell>,
  prev: HashSet.HashSet<Cell.Cell> = HashSet.empty()
) => {
  return from.pipe(
    HashSet.flatMap(Cell.slideableNeighborsEmptyCells),
    HashSet.difference(prev)
  );
};

const movesStrategies = {
  Ant: (from) => {
    let result: HashSet.HashSet<Cell.Cell> = HashSet.empty();
    let next: HashSet.HashSet<Cell.Cell> = HashSet.make(from);

    while (HashSet.size(next) !== 0) {
      const stepResult = slideableNeighborsEmptyCellsStep(next, result);
      next = stepResult;
      result = HashSet.union(result, stepResult);
    }

    return result;
  },
  Grasshopper: (from) =>
    pipe(
      Cell.bordersWithNeighborsOccupied(from),
      Array.map(getEmptyByDiagonal(from)),
      HashSet.fromIterable
    ),
  Beetle: (from) =>
    HashSet.union<Cell.Cell>(
      Cell.slideableNeighborsEmptyCells(from),
      HashSet.fromIterable(
        Array.filter(from.neighbors, Cell.Cell.$is("Occupied"))
      )
    ),
  Spider: (from) => {
    // TODO: Can ref itself ???
    const initOne = HashSet.make(from);
    const stepOne = slideableNeighborsEmptyCellsStep(initOne, initOne);
    const initTwo = HashSet.union(initOne, stepOne);
    const stepTwo = slideableNeighborsEmptyCellsStep(stepOne, initTwo);
    const initThree = HashSet.union(initTwo, stepTwo);

    return slideableNeighborsEmptyCellsStep(stepTwo, initThree);
  },
  QueenBee: (from) => Cell.slideableNeighborsEmptyCells(from),
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
  swarm.pipe(
    findFirstMap(
      Cell.Cell.$match({
        Empty: () => Option.none(),
        Occupied: Option.liftPredicate(Cell.hasBug(bug)),
      })
    ),
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
      const fromCell = findFirstOccupied(swarm, Cell.hasBug(move.bug));

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
  swarm.pipe(
    findFirstOccupiedMap((cell) =>
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
    const connectedOccupiedWithoutCell = reduceWithFilter(
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
  return reduce<Map<Cell.Cell, Coords.Coords>>(
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

export function toString(
  swarm: Swarm,
  options?:
    | {
        highlightEmpty?: HashSet.HashSet<Cell.Cell> | undefined;
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
        [...row].map((cell, i) =>
          cell === undefined
            ? "   "
            : Cell.Cell.$match(cell, {
                Empty: (emptyCell) =>
                  options?.highlightEmpty &&
                  HashSet.has(options.highlightEmpty, emptyCell)
                    ? " × "
                    : " ○ ",
                Occupied: (x) => ` ${Bug.symbol(x.member.bug)} `, //BugDto.encodeSync(x.member.bug),
              })
        )
      )
      // .toReversed()
      .map((x) => x.join(""))
      .toReversed()
      .join("\n\n")
  );
}
