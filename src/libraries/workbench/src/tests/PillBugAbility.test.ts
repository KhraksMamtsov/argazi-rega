import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";
import * as Swarm from "../game/Swarm.ts";
import * as Move from "../game/Move.ts";
import * as GameError from "../game/GameError.ts";
import * as SwarmError from "../game/SwarmError.ts";
import { Either, Effect, Equal } from "effect";
import { describe, expect, it } from "@effect/vitest";
import * as Game from "../game/Game.ts";
import * as GameStep from "../game/GameStep.ts";
import { trimNewline } from "./TestUtills.ts";
import { InitialMoveDto, MoveDto, MovingMoveDto } from "../api/Move.dto.ts";

describe("PillBugAbility", () => {
  it.effect(
    "pillbug ability",
    Effect.fn(function* () {
      const game = yield* Game.Init({
        pillbug: true,
      }).pipe(
        Game.moveAll({
          init: InitialMoveDto.decode("wQ1"),
          moves: [
            MovingMoveDto.decode("b: bP2 wQ1|"),
            MovingMoveDto.decode("w: wG2 |wQ1"),
            MovingMoveDto.decode("b: bQ1 bP2|"),
            MovingMoveDto.decode("w: wG2 bQ1|"),
            MovingMoveDto.decode("b: wQ1 bP2\\"),
          ],
        })
      );

      expect(Game.toString(game)).toBe(trimNewline`
№: 6
⇄: w
w: A1 A2 A3 B1 B2 G1 G3 P1 P2 S1 S2
b: A1 A2 A3 B1 B2 G1 G2 G3 P1 S1 S2
♻: Q̊ !P
       ○     ○ 

    ○     Q̊     ○     ○ 

(○)    P̲̈     Q̲̊     G̈     ○ 

    ○     ○     ○     ○ 
`);

      const gameError = yield* Game.makeMove(
        game,
        MovingMoveDto.decode("w: wQ1 |bP2")
      ).pipe(Either.flip);

      // expect(gameError).toStrictEqual(
      //   new GameError.ImpossibleMove({
      //     move: MovingMoveDto.decode("w: wQ1 |bP2"),
      //     swarmError: new SwarmError.LastMovedByPillbugViolation({
      //       move: MovingMoveDto.decode("w: wQ1 |bP2"),
      //     }),
      //     step: GameStep.GameStep(6),
      //   })
      // );

      expect(
        Equal.equals(
          gameError,
          new GameError.ImpossibleMove({
            move: MovingMoveDto.decode("w: wQ1 |bP2"),
            swarmError: new SwarmError.LastMovedByPillbugViolation({
              move: MovingMoveDto.decode("w: wQ1 |bP2"),
            }),
            step: GameStep.GameStep(6),
          })
        )
      ).toBe(true);
    })
  );
});
