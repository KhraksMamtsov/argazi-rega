import * as GameError from "../domain/GameError.js";
import * as SwarmError from "../domain/SwarmError.js";
import { Either, Effect, Equal } from "effect";
import { describe, expect, it } from "@effect/vitest";
import * as Game from "../domain/Game.js";
import * as GameStep from "../domain/GameStep.js";
import { trimNewline } from "./TestUtills.js";
import {
  InitialGameMoveStr,
  GameMoveStr,
  BugGameMoveStr,
} from "../api/GameMove.str.js";

describe.concurrent("Game", () => {
  it.effect(
    "init",
    Effect.fn(function* () {
      const game = Game.Init({
        ladybug: false,
        mosquito: false,
        pillbug: false,
      });

      expect(Game.toString(game)).toBe("...");
    })
  );

  it.effect(
    "toString",
    Effect.fn(function* () {
      const game = yield* Game.Init({
        ladybug: false,
        mosquito: false,
        pillbug: false,
      }).pipe(
        Game.moveAll({
          init: InitialGameMoveStr.decode("wA1"),
          moves: [BugGameMoveStr.decode("b: bS2 wA1|")],
        })
      );

      expect(Game.toString(game)).toBe(`№: 2
⇄: w
w: A2 A3 B1 B2 G1 G2 G3 Q1 S1 S2
b: A1 A2 A3 B1 B2 G1 G2 G3 Q1 S1
♻: S̲̈
    ○     ○     ○ 

 ○    (Å)    S̲̈     ○ 

    ○     ○     ○ `);
    })
  );

  it.effect(
    "BugNotFound in game",
    Effect.fn(function* () {
      const gameError = yield* Game.Init({
        ladybug: false,
        mosquito: false,
        pillbug: false,
      }).pipe(
        Game.moveAll({
          init: InitialGameMoveStr.decode("wQ1"),
          moves: [BugGameMoveStr.decode("b: bP1 wQ1|")],
        }),
        Either.flip
      );

      expect(gameError).toStrictEqual(
        new GameError.BugNotFound({
          move: BugGameMoveStr.decode("b: bP1 wQ1|"),
          step: GameStep.GameStep.make(1),
        })
      );
    })
  );

  it.effect(
    "wrong turn initial move",
    Effect.fn(function* () {
      const turnError = yield* Game.Init({
        ladybug: false,
        mosquito: false,
        pillbug: false,
      }).pipe(
        Game.moveAll({
          init: InitialGameMoveStr.decode("bA1"),
          moves: [],
        }),
        Either.flip
      );

      expect(turnError).toStrictEqual(
        new GameError.WrongSideMove({
          move: GameMoveStr.decode("bA1"),
          step: GameStep.Init(),
        })
      );
    })
  );

  it.effect(
    "makeMove",
    Effect.fn(function* () {
      const game = yield* Game.Init({
        ladybug: false,
        mosquito: false,
        pillbug: false,
      }).pipe(
        Game.moveAll({ init: InitialGameMoveStr.decode("wA1"), moves: [] })
      );

      expect(game.step, "step increased").toBe(1);
      expect(Game.toString(game)).toBe(
        trimNewline`
№: 1
⇄: b
w: A2 A3 B1 B2 G1 G2 G3 Q1 S1 S2
b: A1 A2 A3 B1 B2 G1 G2 G3 Q1 S1 S2
♻: Å
    ○     ○ 

 ○    (Å)    ○ 

    ○     ○ `
      );
    })
  );

  // it.effect.skip(
  //   "make initial move twice",
  //   Effect.fn(function* () {
  //     const turnError = yield* Game.Init().pipe(
  //       Game.moveAll({
  //         init: InitialMoveDto.decode("wA1"),
  //         moves: [],
  //       }),

  //       Either.flip
  //     );

  //     expect(turnError).toStrictEqual(
  //       new GameError.WrongSideMove({
  //         move: MoveDto.decode("wA1"),
  //         step: GameStep.GameStep(1),
  //       })
  //     );
  //   })
  // );

  // it.effect.skip(
  //   "wrong initial move",
  //   Effect.fn(function* () {
  //     const turnError = yield* Game.Init().pipe(
  //       Game.moveAll({ init:MoveDto.decode("wA1 wA1\\")}),
  //       Either.flip
  //     );

  //     expect(turnError).toStrictEqual(
  //       new GameError.ImpossibleMove({
  //         swarmError: new SwarmError.BugNotFound({
  //           bug: BugDto.decode("wA1"),
  //         }),
  //         move: MoveDto.decode("wA1 wA1\\"),
  //         step: GameStep.Init(),
  //       })
  //     );
  //   })
  // );

  it.effect(
    "introduction violation",
    Effect.fn(function* () {
      const gameError = yield* Game.Init({
        ladybug: false,
        mosquito: false,
        pillbug: true,
      }).pipe(
        Game.moveAll({
          init: InitialGameMoveStr.decode("wQ1"),
          moves: [
            BugGameMoveStr.decode("b: bA1 wQ1|"),
            BugGameMoveStr.decode("w: wP1 wQ1\\"),
          ],
        }),
        Either.flip
      );

      expect(
        Equal.equals(
          gameError,
          new GameError.ImpossibleMove({
            move: BugGameMoveStr.decode("w: wP1 wQ1\\"),
            swarmError: new SwarmError.IntroductionMoveViolation({
              move: BugGameMoveStr.decode("w: wP1 wQ1\\"),
            }),
            step: GameStep.GameStep.make(2),
          })
        )
      ).toBe(true);
    })
  );
});
