import { Schema } from "@effect/schema";

export enum Side {
  Black = "black",
  White = "white",
}

export const _Side = Schema.Enums(Side);
