import { Data, Equal, Option, Either } from "effect";
import * as Match from "./Match.ts";
import * as Player from "./Player.ts";
import * as Bug from "./Bug.ts";
import * as CellBorder from "./CellBorder.ts";
import * as Side from "./Side.ts";
import * as GameMove from "./GameMove.ts";

declare const MathMoveTypeId: unique symbol;
type MathMoveTypeId = typeof MathMoveTypeId;

export class MatchMove extends Data.Class<{
  player: Player.Player;
  bug: Bug.Bug;
  options: Option.Option<{
    neighbor: Bug.Bug;
    cellBorder: CellBorder.CellBorder;
  }>;
}> {
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
