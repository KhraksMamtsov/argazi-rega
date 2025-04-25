import { Brand } from "effect";

export type _MatchId = typeof _MatchId;
export const _MatchId: unique symbol = Symbol.for("game/MatchId");

export type MatchId = Brand.Branded<number, _MatchId>;

export const MatchId = Brand.nominal<MatchId>();
