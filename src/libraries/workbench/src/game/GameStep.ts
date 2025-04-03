import { Brand } from "effect";

export type _GameStep = typeof _GameStep;
export const _GameStep: unique symbol = Symbol.for("game/GameStep");

export type GameStep = Brand.Branded<number, _GameStep>;

export const GameStep = Brand.refined<GameStep>(
  (n) => n >= 0 && Number.isInteger(n),
  (n) => Brand.error(`Expected ${n} to be an positive integer or 0`)
);

const init = GameStep(0);
export const Init = () => init;

export const next = (step: GameStep) => GameStep(step + 1);

export const QueenPlacementViolationStep = GameStep(5);

export const isInitialStep = (step: GameStep) => step === init;
