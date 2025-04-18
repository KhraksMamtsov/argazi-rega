import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";
import * as Swarm from "../game/Swarm.ts";
import * as Move from "../game/Move.ts";
import * as GameError from "../game/GameError.ts";
import * as SwarmError from "../game/SwarmError.ts";
import { Either, Effect } from "effect";
import { describe, expect, it } from "@effect/vitest";
import * as Game from "../game/Game.ts";
import * as GameStep from "../game/GameStep.ts";
import { trimNewline } from "./TestUtills.ts";
import { InitialMoveDto, MoveDto, MovingMoveDto } from "../api/Move.dto.ts";
import { BugDto } from "../api/Bug.dto.ts";

describe("Game", () => {
  it.effect(
    "init",
    Effect.fn(function* () {
      const game = Game.Init();

      expect(Game.toString(game)).toBe("...");
    })
  );

  it.effect(
    "toString",
    Effect.fn(function* () {
      const game = yield* Game.Init().pipe(
        Game.moveAll({
          init: InitialMoveDto.decode("wA1"),
          moves: [MovingMoveDto.decode("bS2 wA1|")],
        })
      );

      expect(Game.toString(game)).toBe(`№: 2
w:S2 Q1 S1 G2 G3 G1 B2 A2 B1 A3
b:Q1 S1 G2 G3 G1 B2 A1 A2 B1 A3
♻: S̲̈
    ○     ○     ○ 

 ○    (Å)    S̲̈     ○ 

    ○     ○     ○ `);
    })
  );

  // it.effect.skip(
  //   "wrong turn move",
  //   Effect.fn(function* () {
  //     const turnError = yield* Game.Init().pipe(
  //       Game.moveAll({ init: InitialMoveDto.decode("bA1"), moves: [] }),
  //       Either.flip
  //     );

  //     expect(turnError).toStrictEqual(
  //       new GameError.WrongSideMove({
  //         move: MoveDto.decode("bA1"),
  //         step: GameStep.Init(),
  //       })
  //     );
  //   })
  // );

  it.effect(
    "makeMove",
    Effect.fn(function* () {
      const game = yield* Game.Init().pipe(
        Game.moveAll({ init: InitialMoveDto.decode("wA1"), moves: [] })
      );

      expect(game.step, "step increased").toBe(1);
      expect(Swarm.toString(game.swarm)).toBe(
        trimNewline`
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
});
