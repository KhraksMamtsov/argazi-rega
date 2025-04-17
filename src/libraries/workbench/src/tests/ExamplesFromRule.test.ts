import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";
import { SideSchema } from "../game/Side.ts";
import * as Swarm from "../game/Swarm.ts";
import * as Move from "../game/Move.ts";
import * as GameError from "../game/GameError.ts";
import * as SwarmError from "../game/SwarmError.ts";
import { Either, Effect } from "effect";
import { describe, expect, it } from "@effect/vitest";
import * as Game from "../game/Game.ts";
import * as GameStep from "../game/GameStep.ts";
import { trimNewline } from "./TestUtills.ts";

describe("Examples from the rules", () => {
  it.effect(
    "QueenBee",
    Effect.fn(function* () {
      const game = Game.Init();

      expect(Swarm.toString(game.swarm)).toBe(" ○ ");
    })
  );
});
