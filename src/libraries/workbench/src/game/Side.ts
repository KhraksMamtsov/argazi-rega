import { Schema } from "effect";
export class SideSchema extends Schema.transformLiterals(
  ["w", "white"],
  ["b", "black"]
).annotations({
  identifier: "Side",
}) {}

export type Side = typeof SideSchema.Type;

const oppositeMap = {
  black: "white",
  white: "black",
} as const satisfies Record<Side, Side>;

export const opposite = <S extends Side>(side: S) => oppositeMap[side];
