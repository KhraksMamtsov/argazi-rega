import { Data, Schema } from "effect";
import * as Bug from "./Bug.ts";
import * as CellBorder from "./CellBorder.ts";
import * as Side from "./Side.ts";

export class BugMove extends Schema.TaggedClass<BugMove>("BugMove")("BugMove", {
  bug: Bug.BugSchema,
  neighbor: Bug.BugSchema,
  cellBorder: CellBorder.CellBorderSchema,
  // side: Side.SideSchema,
}) {}

// export class BeetleMove extends Data.TaggedClass("BeetleMove")<{
//   bug: Bug.Beetle;
//   onto: Bug.Bug;
// }> {}

export class InitialMove extends Schema.TaggedClass<InitialMove>("InitialMove")(
  "InitialMove",
  {
    bug: Bug.BugSchema,
  }
) {}

export type MovingMove = BugMove;
export const MovingMove = Data.taggedEnum<MovingMove>();

export type Move = InitialMove | MovingMove;
export const Move = Data.taggedEnum<Move>();

export const side = (move: Move) => move.bug.side;

export const isNotQueenMove = (move: Move) => Bug.refineNotQueen(move.bug);
