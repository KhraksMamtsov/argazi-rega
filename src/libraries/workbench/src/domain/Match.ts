import { Effect, Random, Schema } from "effect";
import * as MatchId from "./MatchId.ts";
import * as Player from "./Player.ts";
import * as Game from "./Game.ts";
import * as Side from "./Side.ts";
import type { Invite } from "./Invite.ts";

declare const MatchModeTypeId: unique symbol;
type MatchModeTypeId = typeof MatchModeTypeId;
export class MatchMode extends Schema.Class<MatchMode>("MatchMode")({
  mosquito: Schema.BooleanFromUnknown,
  ladybug: Schema.BooleanFromUnknown,
  pillbug: Schema.BooleanFromUnknown,
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
export class Match extends Schema.Class<Match>("Match")({
  id: MatchId.MatchId,
  owner: Player.Player,
  opponent: Player.Player,
  game: Game.Game,
  settings: MatchSettings,
}) {
  declare [MathTypeId]: MathTypeId;
}

export const fromInvite = (invite: Invite, opponent: Player.Player) =>
  Effect.gen(function* () {
    const {
      matchSettings: { mode },
      ownerSide: inviteSettingsOwnerSide,
    } = invite.settings;

    const ownerSide =
      inviteSettingsOwnerSide === "random"
        ? (yield* Random.nextBoolean)
          ? "white"
          : "black"
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
