import {
  Data,
  Array,
  Option,
  Predicate,
  Equal,
  Equivalence as _Equivalence,
  Tuple,
  Hash,
  HashSet,
} from "effect";
import * as Bug from "./Bug.ts";
import { dual, pipe } from "effect/Function";
import * as CellBorder from "./CellBorder.ts";

import * as CellRelation from "./CellRelation.ts";
import * as CoordsDelta from "./CoordsDelta.ts";
import * as Coords from "./Coords.ts";
import { SwarmMember } from "./SwarmMember.ts";

export type Cell = Empty | Occupied;
export const Cell = Data.taggedEnum<Cell>();

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
  static refine(x: Cell): x is Empty {
    return x._tag === "Empty";
  }
  // static isOption = Option.liftPredicate(this.is);
}
export type OccupiedNeighbors = [Cell, Cell, Cell, Cell, Cell, Cell];

export class Occupied<B extends Bug.Bug = Bug.Bug> implements Equal.Equal {
  readonly _tag = "Occupied";
  member: SwarmMember<B>;
  readonly neighbors: OccupiedNeighbors;
  readonly coords: Coords.Coords;

  constructor(options: {
    member: SwarmMember<B>;
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

  setBeetles(beetles: ReadonlyArray<Bug.Beetle>) {
    this.member = new SwarmMember({
      bug: this.member.bug,
      beetles,
    });
    return this;
  }
  static Detached(options: { member: SwarmMember; coords: Coords.Coords }) {
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

export const side = (cell: Occupied) =>
  Array.last(cell.member.beetles).pipe(
    Option.map((x) => x.side),
    Option.getOrElse(() => cell.member.bug.side)
  );

export const masterBug = (cell: Occupied) =>
  Array.last(cell.member.beetles).pipe(
    Option.getOrElse(() => bugInBasis(cell))
  );

export const bugInBasis = <B extends Bug.Bug>(cell: Occupied<B>) =>
  cell.member.bug;

export const withBugInBasis: {
  <B extends Bug.Bug>(bug: B): (cell: Occupied) => cell is Occupied<B>;
  <B extends Bug.Bug>(cell: Occupied, bug: B): cell is Occupied<B>;
} = dual(2, <B extends Bug.Bug>(cell: Occupied, bug: B): cell is Occupied<B> =>
  Equal.equals(bugInBasis(cell), bug)
);

export const hasBug: {
  (bug: Bug.Bug): (cell: Occupied) => boolean;
  (cell: Occupied, bug: Bug.Bug): boolean;
} = dual(
  2,
  (cell: Occupied, bug: Bug.Bug) =>
    Array.contains(cell.member.beetles, bug) || withBugInBasis(cell, bug)
);

export const isBugUnderPressure: {
  (bug: Bug.Bug): (cell: Occupied) => Option.Option<boolean>;
  (cell: Occupied, bug: Bug.Bug): Option.Option<boolean>;
} = dual(
  2,
  (cell: Occupied, bug: Bug.Bug): Option.Option<boolean> =>
    pipe(
      cell,
      Option.liftPredicate(hasBug(bug)),
      Option.map((cell) => !Equal.equals(bug, masterBug(cell)))
    )
);

export const isEmptyOrNoneFromBorder =
  (border: CellBorder.CellBorder) => (cell: Empty) =>
    Option.match(cell.neighbors[border], {
      onNone: () => true,
      onSome: Cell.$match({
        Empty: () => true,
        Occupied: () => false,
      }),
    });

export const bordersWithNeighborsOccupied = Cell.$match({
  Empty: ({ neighbors }) =>
    Array.filterMap(neighbors, (neighbor, border) =>
      Option.flatMap(
        neighbor,
        Cell.$match({
          Empty: () => Option.none(),
          Occupied: () => Option.some(border as CellBorder.CellBorder),
        })
      )
    ),
  Occupied: (x) => _bordersWithNeighborsOccupied(x.neighbors),
});

const _bordersWithNeighborsOccupied = (neighbors: OccupiedNeighbors) =>
  Array.filterMap(neighbors, (neighbor, border) =>
    Cell.$match(neighbor, {
      Empty: () => Option.none(),
      Occupied: () => Option.some(border as CellBorder.CellBorder),
    })
  );

export const isSurroundedWithOccupiedCells = <O extends Occupied>(
  occupied: O
) =>
  pipe(occupied.neighbors, Array.filter(Cell.$is("Occupied"))).length ===
  CellBorder.CELL_BORDERS;

export const slideableNeighborsEmptyCells = (
  cell: Cell // : Array<Empty>
) =>
  pipe(
    bordersWithNeighborsOccupied(cell),
    Array.flatMap(CellBorder.neighbors),
    CellBorder.unique,
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
    x: main.x - neighbor.x,
    y: main.y - neighbor.y,
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
