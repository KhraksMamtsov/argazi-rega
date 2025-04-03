import { Schema } from "effect";

export enum Side {
  Black = "black",
  White = "white",
}

export class _Side extends Schema.Enums(Side) {}
const oppositeMap: Record<Side, Side> = {
  [Side.Black]: Side.White,
  [Side.White]: Side.Black,
};
export const opposite = (side: Side) => oppositeMap[side];
