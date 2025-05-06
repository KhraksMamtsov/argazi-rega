import { Data } from "effect";
import type { CellBorder } from "./CellBorder.js";

export type CellRelation = Data.TaggedEnum<{
  Neighbor: { border: CellBorder };
  Detached: {};
  Same: {};
}>;

export const CellRelation = Data.taggedEnum<CellRelation>();
