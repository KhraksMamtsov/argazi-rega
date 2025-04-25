import { Schema } from "effect";

export type _MatchId = typeof _MatchId;
export const _MatchId: unique symbol = Symbol.for("game/MatchId");
export const MatchId = Schema.String.pipe(Schema.brand(_MatchId));
export type MatchId = typeof MatchId.Type;
