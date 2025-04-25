import { Schema } from "effect";
import type { TupleOf } from "effect/Types";

export type _CoordDeltaId = typeof _CoordDeltaId;
export const _CoordDeltaId: unique symbol = Symbol.for("domain/CoordDeltaId");
export const CoordDelta = Schema.Number.pipe(
  Schema.filter((x) => x % 0.5 === 0),
  Schema.brand(_CoordDeltaId),
  Schema.annotations({
    identifier: "CoordDelta",
  })
);

export type CoordDelta = typeof CoordDelta.Type;

export class CoordsDelta extends Schema.Class<CoordsDelta>("CoordsDelta")({
  x: CoordDelta,
  y: CoordDelta,
}) {}

export type NeighborsVector = TupleOf<6, CoordsDelta>;

export const NeighborsVector: NeighborsVector = [
  new CoordsDelta({ x: CoordDelta.make(0.5), y: CoordDelta.make(1) }),
  new CoordsDelta({ x: CoordDelta.make(1), y: CoordDelta.make(0) }),
  new CoordsDelta({ x: CoordDelta.make(0.5), y: CoordDelta.make(-1) }),
  new CoordsDelta({ x: CoordDelta.make(-0.5), y: CoordDelta.make(-1) }),
  new CoordsDelta({ x: CoordDelta.make(-1), y: CoordDelta.make(0) }),
  new CoordsDelta({ x: CoordDelta.make(-0.5), y: CoordDelta.make(1) }),
];
