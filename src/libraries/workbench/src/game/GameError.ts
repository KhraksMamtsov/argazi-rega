import { Data } from "effect";
import * as Move from "./Move.ts";
import * as GameStep from "./GameStep.ts";
import * as _SwarmError from "./SwarmError.ts";

export class WrongSideMove extends Data.TaggedError("WrongSideMove")<{
  move: Move.Move;
  step: GameStep.GameStep;
}> {}

export class QueenPlacementViolation extends Data.TaggedError(
  "QueenPlacementViolation"
)<{
  move: Move.Move;
  step: GameStep.GameStep;
}> {}

export class ForbiddenInitialMove extends Data.TaggedError(
  "ForbiddenInitialMove"
)<{
  move: Move.Move;
  step: GameStep.GameStep;
}> {}

export class Absurd extends Data.TaggedError("Absurd")<{
  move: Move.Move;
  step: GameStep.GameStep;
}> {}

/**
 * Introducing move has to be made on an empty cell connected ONLY to bug's side cells
 */
export class ForbiddenIntroduceMove extends Data.TaggedError(
  "ForbiddenIntroduceMove"
)<{
  move: Move.Move;
  step: GameStep.GameStep;
}> {}

/**
 * Introducing move has to be made on an empty cell connected ONLY to bug's side cells
 */
export class MoveBeforeQueenBeePlacement extends Data.TaggedError(
  "MoveBeforeQueenBeePlacement"
)<{
  move: Move.Move;
  step: GameStep.GameStep;
}> {}

export class ImpossibleMove extends Data.TaggedError("ImpossibleMove")<{
  move: Move.Move;
  step: GameStep.GameStep;
  swarmError: _SwarmError.SwarmError;
}> {}

export type GameError =
  | WrongSideMove
  | QueenPlacementViolation
  | ForbiddenInitialMove
  | Absurd
  | ForbiddenIntroduceMove
  | ImpossibleMove
  | MoveBeforeQueenBeePlacement;
