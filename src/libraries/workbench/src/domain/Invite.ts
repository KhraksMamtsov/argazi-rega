import { Data } from "effect";
import * as Player from "./Player.ts";
import type { Side } from "./Side.ts";
import { Brand } from "effect";
import type { MatchSettings } from "./Match.ts";

export type _InviteId = typeof _InviteId;
declare const _InviteId: unique symbol;
export type InviteId = Brand.Branded<number, _InviteId>;
export const InviteId = Brand.nominal<InviteId>();

declare const MathTypeId: unique symbol;
type MathTypeId = typeof MathTypeId;

export class Invite extends Data.Class<{
  id: InviteId;
  owner: Player.Player;
  settings: InviteSettings;
}> {
  declare [MathTypeId]: MathTypeId;
}

declare const InviteSettingsTypeId: unique symbol;
type InviteSettingsTypeId = typeof InviteSettingsTypeId;

export class InviteSettings extends Data.Class<{
  ownerSide: Side | "random";
  matchSettings: MatchSettings;
}> {
  declare [InviteSettingsTypeId]: InviteSettingsTypeId;
}
