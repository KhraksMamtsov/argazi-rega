import { Brand } from "effect";

export type _UserId = typeof _UserId;
export const _UserId: unique symbol = Symbol.for("game/UserId");

export type UserId = Brand.Branded<number, _UserId>;

export const UserId = Brand.nominal<UserId>();
