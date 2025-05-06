import { Schema, Equal, Option, Either } from "effect";
import * as Match from "./Match.js";
import * as Player from "./Player.js";

import * as CellBorder from "./CellBorder.js";
import * as Side from "./Side.js";
import * as GameMove from "./GameMove.js";
import { BugStr } from "../api/Bug.str.js";

declare const MathMoveTypeId: unique symbol;
type MathMoveTypeId = typeof MathMoveTypeId;

export class MatchMove extends Schema.Class<MatchMove>("MatchMove")({
  player: Player.Player,
  bug: BugStr,
  options: Schema.OptionFromSelf(
    Schema.Struct({
      neighbor: BugStr,
      cellBorder: CellBorder.CellBorderSchema,
    })
  ),
}) {
  declare [MathMoveTypeId]: MathMoveTypeId;
}

export const toMove = (match: Match.Match, matchMove: MatchMove) =>
  Either.gen(function* () {
    const isMovePlayer = Equal.equals(matchMove.player);

    const side = isMovePlayer(match.owner)
      ? match.settings.ownerSide
      : isMovePlayer(match.opponent)
        ? Side.opposite(match.settings.ownerSide)
        : null;

    if (side === null) {
      return yield* Either.left(123);
    }

    return yield* Option.match(matchMove.options, {
      onNone: () =>
        side === "white"
          ? Either.right(
              new GameMove.InitialGameMove({
                bug: matchMove.bug,
                side,
              })
            )
          : Either.left(123),
      onSome: (x) =>
        Either.right(
          new GameMove.BugGameMove({
            bug: matchMove.bug,
            side,
            cellBorder: x.cellBorder,
            neighbor: x.neighbor,
          })
        ),
    });
  });
