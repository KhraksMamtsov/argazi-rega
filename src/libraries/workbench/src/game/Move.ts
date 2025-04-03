import { Data } from "effect";
import * as Bug from "./Bug.ts";
import * as CellBorder from "./CellBorder.ts";

export class BugMove extends Data.TaggedClass("BugMove")<{
  bug: Bug.Bug;
  neighbor: Bug.Bug;
  cellBorder: CellBorder.CellBorder;
}> {}

export class BeetleMove extends Data.TaggedClass("BeetleMove")<{
  bug: Bug.Beetle;
  onto: Bug.Bug;
}> {}

export class InitialMove extends Data.TaggedClass("InitialMove")<{
  bug: Bug.Bug;
}> {}

export type MovingMove = BugMove;
export const MovingMove = Data.taggedEnum<MovingMove>();

export type Move = InitialMove | MovingMove;
export const Move = Data.taggedEnum<Move>();

export const side = (move: Move) => move.bug.side;

export const isNotQueenMove = (move: Move) => Bug.refineNotQueen(move.bug);
