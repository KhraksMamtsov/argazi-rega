import { Context, Effect, Random, Schema } from "effect";
import * as MatchId from "./MatchId.js";
import * as Player from "./Player.js";
import * as Game from "./Game.js";
import * as Side from "./Side.js";
import type { Invite } from "./Invite.js";

declare const MatchModeTypeId: unique symbol;
type MatchModeTypeId = typeof MatchModeTypeId;
export class MatchMode extends Schema.Class<MatchMode>("MatchMode")({
  mosquito: Schema.Boolean,
  ladybug: Schema.Boolean,
  pillbug: Schema.Boolean,
}) {
  declare [MatchModeTypeId]: MatchModeTypeId;
}

declare const MatchSettingsTypeId: unique symbol;
type MatchSettingsTypeId = typeof MatchSettingsTypeId;
export class MatchSettings extends Schema.Class<MatchSettings>("MatchSettings")(
  {
    ownerSide: Side.SideSchema,
    mode: MatchMode,
  }
) {
  declare [MatchSettingsTypeId]: MatchSettingsTypeId;
}

declare const MathTypeId: unique symbol;
type MathTypeId = typeof MathTypeId;

export class MatchTag extends Context.Tag("Match")<MatchTag, Match>() {}

export class Match extends Schema.Class<Match>("Match")({
  id: MatchId.MatchId,
  owner: Player.Player,
  opponent: Player.Player,
  game: Game.Game,
  settings: MatchSettings,
}) {
  declare [MathTypeId]: MathTypeId;
  getPlayerBySide(side: Side.Side) {
    return this.settings.ownerSide === side ? this.owner : this.opponent;
  }
}

export const fromInvite = (invite: Invite, opponent: Player.Player) =>
  Effect.gen(function* () {
    const { matchMode: mode, ownerSide: inviteSettingsOwnerSide } =
      invite.settings;

    const ownerSide =
      inviteSettingsOwnerSide === "random"
        ? yield* Random.choice(Side.sides)
        : inviteSettingsOwnerSide;

    return new Match({
      id: MatchId.MatchId.make(invite.id),
      game: Game.Init(mode),
      opponent,
      owner: invite.owner,
      settings: new MatchSettings({
        mode,
        ownerSide,
      }),
    });
  });
