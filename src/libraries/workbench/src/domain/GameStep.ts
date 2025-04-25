import { Schema } from "effect";

export type _GameStep = typeof _GameStep;
export const _GameStep: unique symbol = Symbol.for("game/GameStep");

export const GameStep = Schema.Int.pipe(
  Schema.nonNegative(),
  Schema.brand(_GameStep)
);
export type GameStep = typeof GameStep.Type;

const init = GameStep.make(0);
export const Init = () => init;

export const next = (step: GameStep) => GameStep.make(step + 1);

export const QueenPlacementViolationStep = GameStep.make(9);

export const isInitialStep = (step: GameStep) => step === init;
