import { Schema } from "effect";

export class WhiteSideSchema extends Schema.transformLiteral(
  "w",
  "white"
).annotations({
  identifier: "WhiteSideSchema",
}) {}

export class BlackSideSchema extends Schema.transformLiteral(
  "b",
  "black"
).annotations({
  identifier: "BlackSideSchema",
}) {}

export class SideSchema extends Schema.Union(
  WhiteSideSchema,
  BlackSideSchema
).annotations({
  identifier: "Side",
}) {}

export type Side = typeof SideSchema.Type;

const oppositeMap = {
  black: "white",
  white: "black",
} as const satisfies Record<Side, Side>;

export const opposite = <S extends Side>(side: S) => oppositeMap[side];

export const toString = (side: Side) => side[0]!;
