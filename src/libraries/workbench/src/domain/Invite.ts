import { Context, Schema } from "effect";
import * as Player from "./Player.js";
import { SideSchema } from "./Side.js";
import { MatchMode } from "./Match.js";

declare const InviteSettingsTypeId: unique symbol;
type InviteSettingsTypeId = typeof InviteSettingsTypeId;

export class InviteOwnerSide extends Schema.Union(
  SideSchema,
  Schema.Literal("random")
).annotations({
  identifier: "InviteOwnerSide",
}) {}
export class InviteSettings extends Schema.Class<InviteSettings>(
  "InviteSettings"
)({
  ownerSide: InviteOwnerSide,
  matchMode: MatchMode,
}) {
  declare [InviteSettingsTypeId]: InviteSettingsTypeId;
}

export class InviteSettingsTag extends Context.Tag("InviteSettings")<
  InviteSettingsTag,
  InviteSettings
>() {}

export type _InviteId = typeof _InviteId;
export const _InviteId: unique symbol = Symbol.for("game/InviteId");
export const InviteId = Schema.String.pipe(Schema.brand(_InviteId));
export type InviteId = typeof InviteId.Type;

declare const InviteTypeId: unique symbol;
type InviteTypeId = typeof InviteTypeId;

export class Invite extends Schema.Class<Invite>("Invite")({
  id: InviteId,
  owner: Player.Player,
  settings: InviteSettings,
}) {
  declare [InviteTypeId]: InviteTypeId;
}

export class InviteTag extends Context.Tag("Invite")<InviteTag, Invite>() {}
