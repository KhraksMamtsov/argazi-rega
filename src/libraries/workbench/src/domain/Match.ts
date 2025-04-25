import { Data, Effect, Random } from "effect";
import * as MatchId from "./MatchId.ts";
import * as Player from "./Player.ts";
import * as Game from "./Game.ts";
import type { Side } from "./Side.ts";
import type { Invite } from "./Invite.ts";

declare const MathTypeId: unique symbol;
type MathTypeId = typeof MathTypeId;

export class Match extends Data.Class<{
  id: MatchId.MatchId;
  owner: Player.Player;
  opponent: Player.Player;
  game: Game.Game;
  settings: MatchSettings;
}> {
  declare [MathTypeId]: MathTypeId;
}

declare const MatchSettingsTypeId: unique symbol;
type MatchSettingsTypeId = typeof MatchSettingsTypeId;

export class MatchSettings extends Data.Class<{
  ownerSide: Side;
  mode: MatchMode;
}> {
  declare [MatchSettingsTypeId]: MatchSettingsTypeId;
}

declare const MatchModeTypeId: unique symbol;
type MatchModeTypeId = typeof MatchModeTypeId;
export class MatchMode extends Data.Class<{
  mosquito: boolean;
  ladybug: boolean;
  pillbug: boolean;
}> {
  declare [MatchModeTypeId]: MatchModeTypeId;
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
      id: MatchId.MatchId(invite.id),
      game: Game.Init(mode),
      opponent,
      owner: invite.owner,
      settings: new MatchSettings({
        mode,
        ownerSide,
      }),
    });
  });
