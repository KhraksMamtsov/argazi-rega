import { Data } from "effect";
import type { TupleOf } from "effect/Types";

export class CoordsDelta extends Data.TaggedClass("CoordsDelta")<{
  readonly x: number;
  readonly y: number;
}> {}

export type NeighborsVector = TupleOf<6, CoordsDelta>;

export const NeighborsVector: NeighborsVector = [
  new CoordsDelta({ x: 0.5, y: 1 }),
  new CoordsDelta({ x: 1, y: 0 }),
  new CoordsDelta({ x: 0.5, y: -1 }),
  new CoordsDelta({ x: -0.5, y: -1 }),
  new CoordsDelta({ x: -1, y: 0 }),
  new CoordsDelta({ x: -0.5, y: 1 }),
];
