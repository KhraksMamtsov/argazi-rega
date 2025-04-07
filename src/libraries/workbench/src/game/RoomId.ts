import { Brand } from "effect";

export type _RoomId = typeof _RoomId;
export const _RoomId: unique symbol = Symbol.for("game/RoomId");

export type RoomId = Brand.Branded<number, _RoomId>;

export const RoomId = Brand.nominal<RoomId>();
