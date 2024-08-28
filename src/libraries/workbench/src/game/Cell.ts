/* eslint-disable  */
import {
  Data,
  Array,
  Equal,
  Unify,
  HashSet,
  Either,
  Option,
  Predicate,
  Equivalence as _Equivalence,
} from "effect";
import { Schema } from "@effect/schema";
import * as Bug from "./Bug.ts";
import { pipe } from "effect/Function";
import * as CellBorder from "./CellBorder.ts";

export type CellBugs = readonly [Bug.Bug, ...ReadonlyArray<Bug.Beetle>];
export type CellBugsWithBeetle = readonly [
  Bug.Bug,
  Bug.Beetle,
  ...ReadonlyArray<Bug.Beetle>,
];

export type CellRelation = Data.TaggedEnum<{
  Neighbor: { border: CellBorder.CellBorder };
  Detached: {};
  Same: {};
}>;

const CellRelation = Data.taggedEnum<CellRelation>();

export const Equivalence: _Equivalence.Equivalence<Cell> = Equal.equals;

export const relation = (a: CellCoords, b: CellCoords) => {
  if (Equal.equals(a, b)) {
    return CellRelation.Same();
  }

  const possibleX = Unify.unify(
    a.x - 1 === b.x // left
      ? Either.right(HashSet.fromIterable([5, 1, 0] as const))
      : a.x + 1 === b.x // right
        ? Either.right(HashSet.fromIterable([2, 3, 4] as const))
        : Either.left(CellRelation.Detached())
  );

  const possibleY = Unify.unify(
    a.y + 1 === b.y // top
      ? Either.right(HashSet.fromIterable([1, 2] as const))
      : a.y === b.y // middle
        ? Either.right(HashSet.fromIterable([0, 3] as const))
        : a.y - 1 === b.y // bottom
          ? Either.right(HashSet.fromIterable([4, 5] as const))
          : Either.left(CellRelation.Detached())
  );

  return Either.zipWith(possibleX, possibleY, (x, y) =>
    CellRelation.Neighbor({ border: [...HashSet.intersection(x, y)][0]! })
  ).pipe(Either.merge);
};

export type Cell = Empty | Occupied;
export const Cell = Data.taggedEnum<Cell>();

export const match = Cell.$match;

export class CellCoords extends Schema.TaggedClass<CellCoords>("CellCoords")(
  "CellCoords",
  {
    x: Schema.Number,
    y: Schema.Number,
  }
) {
  static Null = new CellCoords({ x: 0, y: 0 });
  static Neighbors = (coords: CellCoords) =>
    [
      new CellCoords({ x: coords.x - 1, y: coords.y - 0 }), // 0
      new CellCoords({ x: coords.x - 1, y: coords.y - 1 }), // 1
      new CellCoords({ x: coords.x + 0, y: coords.y - 1 }), // 2
      new CellCoords({ x: coords.x + 1, y: coords.y + 0 }), // 3
      new CellCoords({ x: coords.x + 0, y: coords.y + 1 }), // 4
      new CellCoords({ x: coords.x - 1, y: coords.y + 1 }), // 5
    ] as const;
}

export class Empty extends Data.TaggedClass("Empty")<{
  coords: CellCoords;
  neighbors: [
    Option.Option<Cell>,
    Option.Option<Cell>,
    Option.Option<Cell>,
    Option.Option<Cell>,
    Option.Option<Cell>,
    Option.Option<Cell>,
  ];
}> {
  static Empty = () =>
    new Empty({
      coords: new CellCoords({ x: 0, y: 0 }),
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
export type Neighbors = [Cell, Cell, Cell, Cell, Cell, Cell];

export class Occupied<
  Bugs extends CellBugs = CellBugs,
> extends Data.TaggedClass("Occupied")<{
  bugs: Bugs;
  coords: CellCoords;
  neighbors: Neighbors;
}> {
  // get coords() {
  // this.coords
  // }
  get id() {
    return [this.coords.x, this.coords.y].join(",");
  }
  get side() {
    return Array.lastNonEmpty(this.bugs).side;
  }
  static is(x: unknown): x is Occupied {
    return (
      typeof x === "object" &&
      x !== null &&
      "_tag" in x &&
      x._tag === "CellWithBug"
    );
  }
}

export const isEmptyOrNoneFromBorder =
  (border: CellBorder.CellBorder) => (cell: Empty) =>
    Option.match(cell.neighbors[border], {
      onNone: () => true,
      onSome: match({
        Empty: () => true,
        Occupied: () => false,
      }),
    });

// export const detachedCellWithBug = (bug: Bug.Bug) => {
//   return new CellWithBug({
//     bug: [bug],
//     coords: CellCoords.Null,
//     neighbors: [
//       new EmptyCell({ coords: CellCoords.Null, neighbors: [O.Option] }),
//       new EmptyCell({ coords: CellCoords.Null }),
//       new EmptyCell({ coords: CellCoords.Null }),
//       new EmptyCell({ coords: CellCoords.Null }),
//       new EmptyCell({ coords: CellCoords.Null }),
//       new EmptyCell({ coords: CellCoords.Null }),
//     ],
//   });
// };

// export const unsafeSetNeighbour =
//   (cell: Cell) => (options: { border: CellBorder; neighbour: Cell }) => {
//     cell;
//   };

// export const possible

// export const landBug = (emptyCell: EmptyCell, bug: Bug.Bug) =>
//   Either.gen(function* () {});

export const bordersWithNeighborsOccupied = match({
  Empty: ({ neighbors }) =>
    Array.filterMap(neighbors, (neighbor, border) =>
      Option.flatMap(
        neighbor,
        match({
          Empty: () => Option.none(),
          Occupied: () => Option.some(border as CellBorder.CellBorder),
        })
      )
    ),
  Occupied: (x) => _bordersWithNeighborsOccupied(x.neighbors),
});

const _bordersWithNeighborsOccupied = (neighbors: Neighbors) =>
  Array.filterMap(neighbors, (neighbor, border) =>
    match(neighbor, {
      Empty: () => Option.none(),
      Occupied: () => Option.some(border as CellBorder.CellBorder),
    })
  );

export const slideableNeighborsEmptyCells = (cell: Cell): Array<Empty> =>
  pipe(
    bordersWithNeighborsOccupied(cell),
    Array.flatMap(CellBorder.neighbors),
    CellBorder.unique,
    Array.filterMap((slideableCellBorder) => {
      let neighborCell = cell.neighbors[slideableCellBorder];

      if (Option.isOption(neighborCell)) {
        if (Option.isNone(neighborCell)) {
          return Option.none();
        }

        neighborCell = neighborCell.value;
      }

      if (
        Empty.refine(neighborCell) &&
        isAccessibleFromBorder(slideableCellBorder)
      ) {
        return Option.some(neighborCell);
      } else {
        return Option.none();
      }
    })
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
