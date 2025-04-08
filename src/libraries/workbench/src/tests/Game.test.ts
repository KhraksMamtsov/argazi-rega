import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";
import { Side } from "../game/Side.ts";
import * as Swarm from "../game/Swarm.ts";
import * as Move from "../game/Move.ts";
import * as GameError from "../game/GameError.ts";
import * as SwarmError from "../game/SwarmError.ts";
import { Either, Effect } from "effect";
import { describe, expect, it } from "@effect/vitest";
import * as Game from "../game/Game.ts";
import * as GameStep from "../game/GameStep.ts";
import { trimNewline } from "./TestUtills.ts";

describe("Game", () => {
  it.effect(
    "init",
    Effect.fn(function* () {
      const game = Game.Init();

      expect(Swarm.toString(game.swarm)).toBe(" ○ ");
    })
  );

  it.effect(
    "wrong turn move",
    Effect.fn(function* () {
      const turnError = yield* Game.Init().pipe(
        Game.makeMove(
          new Move.InitialMove({
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.Black,
            }),
          })
        ),
        Either.flip
      );

      expect(turnError).toStrictEqual(
        new GameError.WrongSideMove({
          move: new Move.InitialMove({
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.Black,
            }),
          }),
          step: GameStep.Init(),
        })
      );
    })
  );

  it.effect(
    "makeMove",
    Effect.fn(function* () {
      const game = yield* Game.Init().pipe(
        Game.makeMove(
          new Move.InitialMove({
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
          })
        )
      );

      expect(game.step, "step increased").toBe(1);
      expect(Swarm.toString(game.swarm)).toBe(
        trimNewline`
    ○     ○ 

 ○     Å     ○ 

    ○     ○ `
      );
    })
  );

  it.effect(
    "make initial move twice",
    Effect.fn(function* () {
      const turnError = yield* Game.Init().pipe(
        Game.moveAll([
          new Move.InitialMove({
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
          }),
          new Move.InitialMove({
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
          }),
        ]),
        Either.flip
      );

      expect(turnError).toStrictEqual(
        new GameError.WrongSideMove({
          move: new Move.InitialMove({
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
          }),
          step: GameStep.GameStep(1),
        })
      );
    })
  );

  it.effect(
    "wrong initial move",
    Effect.fn(function* () {
      const turnError = yield* Game.Init().pipe(
        Game.moveAll([
          new Move.BugMove({
            cellBorder: 0,
            neighbor: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
          }),
        ]),
        Either.flip
      );

      expect(turnError).toStrictEqual(
        new GameError.ImpossibleMove({
          swarmError: new SwarmError.BugNotFound({
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
          }),
          move: new Move.BugMove({
            cellBorder: 0,
            neighbor: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
            bug: new Bug.Ant({
              number: BugNumber.One(1),
              side: Side.White,
            }),
          }),
          step: GameStep.Init(),
        })
      );
    })
  );
});
