import { Data } from "effect";
import * as Cell from "./Cell.ts";
import * as Bug from "./Bug.ts";

export class OneSurrounded extends Data.TaggedClass("OneSurrounded")<{
  cell: Cell.Occupied<Bug.QueenBee>;
}> {}

export class BothSurrounded extends Data.TaggedClass("BothSurrounded")<{
  cells: [Cell.Occupied<Bug.QueenBee>, Cell.Occupied<Bug.QueenBee>];
}> {}

export class Free extends Data.TaggedClass("Free") {}

export type QueenBeeState = OneSurrounded | BothSurrounded | Free;

export const QueenBeeState = Data.taggedEnum<QueenBeeState>();
