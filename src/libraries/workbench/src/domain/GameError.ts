import { Data } from "effect";
import * as Move from "./GameMove.ts";
import * as GameStep from "./GameStep.ts";
import * as _SwarmError from "./SwarmError.ts";

export class WrongSideMove extends Data.TaggedError("WrongSideMove")<{
  move: Move.GameMove;
  step: GameStep.GameStep;
}> {}

export class QueenPlacementViolation extends Data.TaggedError(
  "QueenPlacementViolation"
)<{
  move: Move.GameMove;
  step: GameStep.GameStep;
}> {}

export class BugNotFound extends Data.TaggedError("BugNotFound")<{
  move: Move.GameMove;
  step: GameStep.GameStep;
}> {}

export class ForbiddenInitialMove extends Data.TaggedError(
  "ForbiddenInitialMove"
)<{
  move: Move.GameMove;
  step: GameStep.GameStep;
}> {}

export class Absurd extends Data.TaggedError("Absurd")<{
  move: Move.GameMove;
  step: GameStep.GameStep;
}> {}

export class ImpossibleMove extends Data.TaggedError("ImpossibleMove")<{
  move: Move.GameMove;
  step: GameStep.GameStep;
  swarmError: _SwarmError.SwarmError;
}> {}

export type GameError =
  | WrongSideMove
  | QueenPlacementViolation
  | ForbiddenInitialMove
  | Absurd
  | BugNotFound
  | ImpossibleMove;
