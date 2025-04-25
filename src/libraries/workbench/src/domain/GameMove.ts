import { Data, Schema } from "effect";
import * as Bug from "./Bug.ts";
import * as CellBorder from "./CellBorder.ts";
import * as Side from "./Side.ts";

export class BugGameMove extends Schema.TaggedClass<BugGameMove>("BugGameMove")(
  "BugGameMove",
  {
    bug: Bug.BugSchema,
    neighbor: Bug.BugSchema,
    cellBorder: CellBorder.CellBorderSchema,
    side: Side.SideSchema,
  }
) {}

export class InitialGameMove extends Schema.TaggedClass<InitialGameMove>(
  "InitialGameMove"
)("InitialGameMove", { bug: Bug.BugSchema, side: Side.WhiteSideSchema }) {}

export type GameMove = InitialGameMove | BugGameMove;
export const GameMove = Data.taggedEnum<GameMove>();

export const side = (move: GameMove) => move.side;

export const isNotQueenMove = (move: GameMove) => Bug.refineNotQueen(move.bug);
