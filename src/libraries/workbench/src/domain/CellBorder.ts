import { Schema } from "effect";

export const CELL_BORDERS = 6;
export class CellBorderSchema extends Schema.Literal(
  0,
  1,
  2,
  3,
  4,
  5
).annotations({
  identifier: "CellBorder",
}) {}

export type CellBorder = typeof CellBorderSchema.Type;
export const CellBorders = CellBorderSchema.literals;

const neighborsMap = {
  0: [5, 1],
  1: [0, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 0],
} as const satisfies Record<CellBorder, [CellBorder, CellBorder]>;

const oppositeMap = {
  0: 3,
  1: 4,
  2: 5,
  3: 0,
  4: 1,
  5: 2,
} as const satisfies Record<CellBorder, CellBorder>;

export const neighbors = <CB extends CellBorder>(border: CB) =>
  neighborsMap[border];

export const opposite = <CB extends CellBorder>(border: CB) =>
  oppositeMap[border];

export const unique = (cellBorders: ReadonlyArray<CellBorder>) => [
  ...new Set(cellBorders),
];
