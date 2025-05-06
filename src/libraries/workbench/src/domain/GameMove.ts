import { Schema } from "effect";
import * as Bug from "./Bug.js";
import * as CellBorder from "./CellBorder.js";
import * as Side from "./Side.js";

export class BugGameMove extends Schema.TaggedClass<BugGameMove>("BugGameMove")(
  "BugGameMove",
  {
    cellBorder: CellBorder.CellBorderSchema,
    side: Side.SideSchema,
    bug: Bug.Bug,
    neighbor: Bug.Bug,
  }
) {}

export class InitialGameMove extends Schema.TaggedClass<InitialGameMove>(
  "InitialGameMove"
)("InitialGameMove", { bug: Bug.Bug, side: Side.WhiteSideSchema }) {}

export type GameMove = typeof GameMove.Type;
export const GameMove = Schema.Union(InitialGameMove, BugGameMove).annotations({
  identifier: "GameMove",
});

export const _GameMovesHistory = Schema.Tuple(
  [InitialGameMove] as const,
  BugGameMove
).annotations({
  identifier: "GameMovesHistory",
});

export const GameMovesHistory = Schema.Array(Schema.typeSchema(GameMove)).pipe(
  Schema.compose(Schema.typeSchema(_GameMovesHistory))
);

export const side = (move: GameMove) => move.side;

export const isNotQueenMove = (move: GameMove) => Bug.refineNotQueen(move.bug);
