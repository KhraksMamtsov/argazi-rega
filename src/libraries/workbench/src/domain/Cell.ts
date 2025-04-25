import {
  Data,
  Array,
  Option,
  Predicate,
  Equal,
  Tuple,
  Hash,
  HashSet,
  HashMap,
} from "effect";
import * as Bug from "./Bug.ts";
import { dual, pipe } from "effect/Function";
import * as CellBorder from "./CellBorder.ts";

import * as CellRelation from "./CellRelation.ts";
import * as CoordsDelta from "./CoordsDelta.ts";
import * as Coords from "./Coords.ts";
import * as SwarmMember from "./SwarmMember.ts";

export type Cell = Empty | Occupied;
const Cell = Data.taggedEnum<Cell>();

export const match = Cell.$match;
export const refine: {
  <T extends Cell["_tag"]>(
    tag: T
  ): (cell: Cell) => cell is Extract<Cell, { _tag: T }>;
  <T extends Cell["_tag"]>(
    cell: Cell,
    tag: T
  ): cell is Extract<Cell, { _tag: T }>;
} = dual(
  2,
  <T extends Cell["_tag"]>(
    cell: Cell,
    tag: T
  ): cell is Extract<Cell, { _tag: T }> => Cell.$is(tag)(cell)
);
export type EmptyNeighbors = [
  Option.Option<Cell>,
  Option.Option<Cell>,
  Option.Option<Cell>,
  Option.Option<Cell>,
  Option.Option<Cell>,
  Option.Option<Cell>,
];

export class Empty implements Equal.Equal {
  readonly _tag = "Empty";
  neighbors: EmptyNeighbors;
  readonly coords: Coords.Coords;

  constructor(options: { neighbors: EmptyNeighbors; coords: Coords.Coords }) {
    this.neighbors = options.neighbors;
    this.coords = options.coords;
  }
  [Equal.symbol](that: unknown): boolean {
    return Empty.is(that) && Equal.equals(this.coords, that.coords);
  }
  [Hash.symbol](): number {
    return Hash.hash(this.coords);
  }
  static Detached = (coords: Coords.Coords) =>
    new Empty({
      coords,
      neighbors: [
        Option.none(),
        Option.none(),
        Option.none(),
        Option.none(),
        Option.none(),
        Option.none(),
      ],
    });

  static is(x: unknown): x is Empty {
    return Cell.$is("Empty")(x);
  }
}
export type OccupiedNeighbors = [Cell, Cell, Cell, Cell, Cell, Cell];

export class Occupied<B extends Bug.Bug = Bug.Bug>
  implements Hash.Hash, Equal.Equal
{
  readonly _tag = "Occupied";
  member: SwarmMember.SwarmMember.With<B>;
  readonly neighbors: OccupiedNeighbors;
  readonly coords: Coords.Coords;

  constructor(options: {
    member: SwarmMember.SwarmMember.With<B>;
    neighbors: OccupiedNeighbors;
    coords: Coords.Coords;
  }) {
    this.member = options.member;
    this.neighbors = options.neighbors;
    this.coords = options.coords;
  }

  [Equal.symbol](that: unknown): boolean {
    return Cell.$is("Occupied")(that) && Equal.equals(this.coords, that.coords);
  }
  [Hash.symbol](): number {
    return Hash.hash(this.coords);
  }
  static Detached(options: {
    member: SwarmMember.SwarmMember;
    coords: Coords.Coords;
  }) {
    const neighbors = Tuple.map(
      Coords.Coords.Neighbors(options.coords),
      Empty.Detached
    );

    const occupiedCell = new Occupied({
      coords: options.coords,
      member: options.member,
      neighbors,
    });

    neighbors.forEach((currentCell, i, _neighbors) => {
      // link occupied with empty
      occupiedCell.neighbors[i as CellBorder.CellBorder] = currentCell;
      const currentCellBorder = CellBorder.opposite(i as CellBorder.CellBorder);
      currentCell.neighbors[currentCellBorder] = Option.some(occupiedCell);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const nextCell = _neighbors[(i + 1) % CellBorder.CELL_BORDERS]!;
      const currentCellNextBorder = ((CellBorder.CELL_BORDERS +
        currentCellBorder -
        1) %
        CellBorder.CELL_BORDERS) as CellBorder.CellBorder;

      // link current empty and next empty
      currentCell.neighbors[currentCellNextBorder] = Option.some(nextCell);
      nextCell.neighbors[CellBorder.opposite(currentCellNextBorder)] =
        Option.some(currentCell);
    });

    return occupiedCell;
  }
}

export const side = (cell: Occupied) => masterBug(cell).side;

export const masterBug = (cell: Occupied) =>
  Array.last(cell.member.cover).pipe(Option.getOrElse(() => bugInBasis(cell)));

export const bugInBasis = <B extends Bug.Bug>(cell: Occupied<B>) =>
  cell.member.bug;

export const withBugInBasis: {
  <B extends Bug.Bug>(bug: B): (cell: Occupied) => cell is Occupied<B>;
  <B extends Bug.Bug>(cell: Occupied, bug: B): cell is Occupied<B>;
} = dual(2, <B extends Bug.Bug>(cell: Occupied, bug: B): cell is Occupied<B> =>
  Equal.equals(bugInBasis(cell), bug)
);

export const refineBugInBasis: {
  <A extends Bug.Bug, B extends A>(
    refinement: Predicate.Refinement<A, B>
  ): (cell: Occupied<A>) => cell is Occupied<B>;
  <A extends Bug.Bug, B extends A>(
    cell: Occupied<A>,
    refinement: Predicate.Refinement<A, B>
  ): cell is Occupied<B>;
} = dual(
  2,
  <A extends Bug.Bug, B extends A>(
    cell: Occupied<A>,
    refinement: Predicate.Refinement<A, B>
  ): cell is Occupied<B> => refinement(cell.member.bug)
);

export const hasBug: {
  (bug: Bug.Bug): (cell: Occupied) => Option.Option<number>;
  (cell: Occupied, bug: Bug.Bug): Option.Option<number>;
} = dual(2, (cell: Occupied, bug: Bug.Bug): Option.Option<number> => {
  return Array.findFirstIndex(cell.member.cover, Equal.equals(bug)).pipe(
    Option.map((x) => x + 1),
    Option.orElse(() =>
      withBugInBasis(cell, bug) ? Option.some(0) : Option.none()
    )
  );
});

export const isBugUnderPressure: {
  (bug: Bug.Bug): (cell: Occupied) => Option.Option<boolean>;
  (cell: Occupied, bug: Bug.Bug): Option.Option<boolean>;
} = dual(
  2,
  (cell: Occupied, bug: Bug.Bug): Option.Option<boolean> =>
    pipe(
      cell,
      Option.liftPredicate((x) => hasBug(x, bug).pipe(Option.isSome)),
      Option.map((cell) => !Equal.equals(bug, masterBug(cell)))
    )
);

export const isWithCover = (cell: Occupied) =>
  Array.isNonEmptyReadonlyArray(cell.member.cover);

export const isEmptyOrNoneFromBorder =
  (border: CellBorder.CellBorder) => (cell: Empty) =>
    Option.match(cell.neighbors[border], {
      onNone: () => true,
      onSome: Cell.$match({
        Empty: () => true,
        Occupied: () => false,
      }),
    });

export const neighborsOccupied = Cell.$match({
  Empty: ({ neighbors }) =>
    Array.filterMap(neighbors, (neighbor, border) =>
      Option.flatMap(
        neighbor,
        Cell.$match({
          Empty: () => Option.none(),
          Occupied: (occupied) =>
            Option.some({
              occupied,
              border: border as CellBorder.CellBorder,
            }),
        })
      )
    ),
  Occupied: (x) => _neighborsOccupied(x.neighbors),
});

const _neighborsOccupied = (neighbors: OccupiedNeighbors) =>
  Array.filterMap(neighbors, (neighbor, border) =>
    Cell.$match(neighbor, {
      Empty: () => Option.none(),
      Occupied: (occupied) =>
        Option.some({
          occupied,
          border: border as CellBorder.CellBorder,
        }),
    })
  );
export const bordersWithNeighborsOccupied = (cell: Cell) =>
  pipe(
    neighborsOccupied(cell),
    Array.map((x) => x.border)
  );

export const isSurroundedWithOccupiedCells = (occupied: Occupied) =>
  pipe(occupied.neighbors, Array.filter(refine("Occupied"))).length ===
  CellBorder.CELL_BORDERS;

export const slideableNeighborsEmptyCells = (
  cell: Cell // : Array<Empty>
) =>
  pipe(
    bordersWithNeighborsOccupied(cell),
    Array.flatMap(CellBorder.neighbors),
    CellBorder.unique,
    (x) => {
      return x;
    },
    Array.filterMap((cellBorder) => {
      const [leftNeighborBorder, rightNeighborBorder] =
        CellBorder.neighbors(cellBorder);

      return Cell.$match(cell, {
        Empty: (emptyCell) => {
          const cellN = emptyCell.neighbors[cellBorder];
          if (Option.isNone(cellN)) {
            // TODO replace with SwarmError.Absurd
            throw new Error("Can't be Option.None");
          }

          return Cell.$match(cellN.value, {
            Empty: (emptyCellN) => {
              const leftNeighbor = emptyCell.neighbors[leftNeighborBorder];
              const rightNeighbor = emptyCell.neighbors[rightNeighborBorder];
              const isNeighborOk = Option.match<boolean, Cell>({
                onNone: () => true,
                onSome: (x) => Empty.is(x),
              });
              return isNeighborOk(leftNeighbor) || isNeighborOk(rightNeighbor)
                ? Option.some(emptyCellN)
                : Option.none();
            },
            Occupied: () => Option.none(),
          });
        },
        Occupied: (occupiedCell) => {
          const cellN = occupiedCell.neighbors[cellBorder];

          return Cell.$match(cellN, {
            Empty: (emptyCellN) =>
              Empty.is(occupiedCell.neighbors[leftNeighborBorder]) ||
              Empty.is(occupiedCell.neighbors[rightNeighborBorder])
                ? Option.some(emptyCellN)
                : Option.none(),
            Occupied: () => Option.none(),
          });
        },
      });
    }),
    HashSet.fromIterable
  );

export const isAccessibleFromBorder = (border: CellBorder.CellBorder) => {
  const [neighborBorderA, neighborBorderB] = CellBorder.neighbors(border);
  const accessibleFromBorder = isEmptyOrNoneFromBorder(border);
  const accessibleFromNeighborA = isEmptyOrNoneFromBorder(neighborBorderA);
  const accessibleFromNeighborB = isEmptyOrNoneFromBorder(neighborBorderB);

  return Predicate.and(
    accessibleFromBorder,
    Predicate.or(accessibleFromNeighborA, accessibleFromNeighborB)
  );
};

export function getCellRelationByCoords(options: {
  readonly main: Coords.Coords;
  readonly neighbor: Coords.Coords;
}): CellRelation.CellRelation {
  const { main, neighbor } = options;

  const delta = new CoordsDelta.CoordsDelta({
    x: CoordsDelta.CoordDelta.make(main.x - neighbor.x),
    y: CoordsDelta.CoordDelta.make(main.y - neighbor.y),
  });

  const equalsDelta = Equal.equals(delta);

  if (equalsDelta(Coords.Coords.Zero)) {
    return CellRelation.CellRelation.Same();
  }

  return Array.findFirstIndex(CoordsDelta.NeighborsVector, equalsDelta).pipe(
    Option.map((x) =>
      CellRelation.CellRelation.Neighbor({
        border: x as CellBorder.CellBorder,
      })
    ),
    Option.getOrElse(() => CellRelation.CellRelation.Detached())
  );
}

export const reduceWithFilter = <B, C extends Cell>(
  startCell: Cell,
  b: B,
  filterPath: Predicate.Refinement<Cell, C>,
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

    Cell.$match(currentCell, {
      Occupied: (x) => cellsToVisit.push(...x.neighbors),
      Empty: (x) => cellsToVisit.push(...pipe(x.neighbors, Array.getSomes)),
    });

    visitedCells.add(currentCell);
  }

  return acc;
};

export const reduce = <B>(
  initialCell: Cell,
  b: B,
  f: (b: B, a: Cell) => B
): B => reduceWithFilter(initialCell, b, (x): x is Cell => true, f);

export const toField = (cell: Cell) =>
  reduce(
    cell,
    HashMap.empty<Coords.Coords, SwarmMember.SwarmMember>(),
    (field, cell) =>
      Cell.$match(cell, {
        Empty: () => field,
        Occupied: (occupied) =>
          HashMap.set(field, occupied.coords, occupied.member),
      })
  );

export const filter = (predicate: Predicate.Predicate<Cell>) => (cell: Cell) =>
  reduce<Array<Cell>>(cell, Array.empty(), (acc, cur) => {
    if (predicate(cur)) {
      acc.push(cur);
    }
    return acc;
  });

export const findFirst: {
  (predicate: (cell: Cell) => boolean): (cell: Cell) => Option.Option<Cell>;
  (cell: Cell, predicate: (cell: Cell) => boolean): Option.Option<Cell>;
} = dual(2, (cell: Cell, predicate: (cell: Cell) => boolean) => {
  const predicateOption = Option.liftPredicate(predicate);

  return reduce(cell, Option.none<Cell>(), (acc, cur) =>
    acc.pipe(Option.orElse(() => predicateOption(cur)))
  );
});

export const findFirstMap: {
  <A>(
    predicate: (cell: Cell) => Option.Option<A>
  ): (cell: Cell) => Option.Option<A>;
  <A>(
    cell: Cell,
    predicate: (cell: Cell) => Option.Option<A>
  ): Option.Option<A>;
} = dual(2, <A>(cell: Cell, predicate: (cell: Cell) => Option.Option<A>) =>
  reduce(cell, Option.none<A>(), (acc, cur) =>
    acc.pipe(Option.orElse(() => predicate(cur)))
  )
);

export const findFirstOccupiedMap: {
  <A>(
    predicate: (cell: Occupied) => Option.Option<A>
  ): (cell: Cell) => Option.Option<A>;
  <A>(
    cell: Cell,
    predicate: (cell: Occupied) => Option.Option<A>
  ): Option.Option<A>;
} = dual(2, <A>(cell: Cell, predicate: (cell: Occupied) => Option.Option<A>) =>
  findFirstMap(
    cell,
    Cell.$match({
      Empty: () => Option.none(),
      Occupied: predicate,
    })
  )
);

export const findFirstOccupied: {
  (
    predicate: (cell: Occupied) => boolean
  ): (cell: Cell) => Option.Option<Occupied>;
  (cell: Cell, predicate: (cell: Occupied) => boolean): Option.Option<Occupied>;
} = dual(2, (cell: Cell, predicate: (cell: Occupied) => boolean) =>
  findFirstOccupiedMap(cell, Option.liftPredicate(predicate))
);

export const findFirstEmptyMap: {
  <A>(
    predicate: (cell: Empty) => Option.Option<A>
  ): (cell: Cell) => Option.Option<A>;
  <A>(
    cell: Cell,
    predicate: (cell: Empty) => Option.Option<A>
  ): Option.Option<A>;
} = dual(2, <A>(cell: Cell, predicate: (cell: Empty) => Option.Option<A>) =>
  findFirstMap(
    cell,
    Cell.$match({
      Empty: predicate,
      Occupied: () => Option.none(),
    })
  )
);

export const findFirstEmpty: {
  (predicate: (cell: Empty) => boolean): (cell: Cell) => Option.Option<Empty>;
  (cell: Cell, predicate: (cell: Empty) => boolean): Option.Option<Empty>;
} = dual(2, (cell: Cell, predicate: (cell: Empty) => boolean) =>
  findFirstEmptyMap(cell, Option.liftPredicate(predicate))
);

type BeetleGateStrategy = "climb" | "pass";

const beetleGateStrategyIncrement = {
  climb: 1,
  pass: 0,
} as const satisfies Record<BeetleGateStrategy, 0 | 1>;

export const beetleMovingNeighbors: {
  (options: {
    from: Occupied;
    level: number;
    strategy: "climb";
  }): HashSet.HashSet<Occupied>;
  (options: {
    from: Occupied;
    level: number;
    strategy: "pass";
  }): HashSet.HashSet<Cell>;
} = (options: {
  from: Occupied;
  level: number;
  strategy: BeetleGateStrategy;
}) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  pipe(
    options.strategy === "climb"
      ? Array.map(neighborsOccupied(options.from), (x) => ({
          border: x.border,
          cell: x.occupied,
        }))
      : Tuple.map(CellBorder.CellBorders, (border) => ({
          border,
          cell: options.from.neighbors[border],
        })),
    Array.map((x) => x),
    Array.filter((x) =>
      isClimbableFromBorder({
        target: x.cell,
        border: CellBorder.opposite(x.border),
        level: options.level + beetleGateStrategyIncrement[options.strategy],
      })
    ),
    Array.map((x) => x.cell),
    HashSet.fromIterable
  ) as any;

const isClimbableFromBorder = (options: {
  target: Cell;
  border: CellBorder.CellBorder;
  level: number;
}) => {
  const [neighborBorderA, neighborBorderB] = CellBorder.neighbors(
    options.border
  );
  const test = isObstacleForMovingFromLevel(options.level);

  const neighborA = options.target.neighbors[neighborBorderA];
  const neighborB = options.target.neighbors[neighborBorderB];

  let occupiedNeighborA: Cell;
  if (Option.isOption(neighborA)) {
    if (Option.isNone(neighborA)) {
      throw new Error("isClimbableFromBorder: neighborA");
    }
    occupiedNeighborA = neighborA.value;
  } else {
    occupiedNeighborA = neighborA;
  }
  let occupiedNeighborB: Cell;
  if (Option.isOption(neighborB)) {
    if (Option.isNone(neighborB)) {
      throw new Error("isClimbableFromBorder: neighborB");
    }
    occupiedNeighborB = neighborB.value;
  } else {
    occupiedNeighborB = neighborB;
  }

  const isObstacleForMovingA = test(occupiedNeighborA);
  const isObstacleForMovingB = test(occupiedNeighborB);
  return !isObstacleForMovingA || !isObstacleForMovingB;
};

const isObstacleForMovingFromLevel = (level: number) =>
  match({
    Empty: () => false,
    Occupied: (occupied) =>
      SwarmMember.bugFromLevel(occupied.member, level).pipe(Option.isSome),
  });
