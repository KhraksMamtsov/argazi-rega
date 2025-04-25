import { Equal, Schema } from "effect";
import { hasProperty } from "effect/Predicate";

export type _PlayerId = typeof _PlayerId;
export const _PlayerId: unique symbol = Symbol.for("game/PlayerId");
export const PlayerId = Schema.String.pipe(Schema.brand(_PlayerId));
export type PlayerId = typeof PlayerId.Type;

export const PlayerTypeId: unique symbol = Symbol.for("game/PlayerTypeId");
export type PlayerTypeId = typeof PlayerTypeId;

export class Player extends Schema.Class<Player>("Player")({
  id: PlayerId,
}) {
  [PlayerTypeId] = PlayerTypeId;
  [Equal.symbol](that: unknown): boolean {
    return is(that) && Equal.equals(this.id, that.id);
  }
}

export const is = (x: unknown): x is Player => hasProperty(x, PlayerTypeId);
