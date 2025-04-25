import { Data } from "effect";
import * as Move from "./GameMove.ts";
import * as Bug from "./Bug.ts";
import * as Cell from "./Cell.ts";

export class SplitSwarm extends Data.TaggedError("SplitSwarm")<{
  cell: Cell.Occupied;
}> {}

export class BugNotFound extends Data.TaggedError("BugNotFound")<{
  bug: Bug.Bug;
}> {}

export class BeetlePressure extends Data.TaggedError("BeetlePressure")<{
  move: Move.BugGameMove;
}> {}

export class ImpossibleMove extends Data.TaggedError("ImpossibleMove")<{
  move: Move.BugGameMove;
}> {}
export class IntroductionMoveViolation extends Data.TaggedError(
  "IntroductionMoveViolation"
)<{
  move: Move.BugGameMove;
}> {}
export class MoveBeforeQueenBeePlacementViolation extends Data.TaggedError(
  "MoveBeforeQueenBeePlacementViolation"
)<{
  move: Move.BugGameMove;
}> {}

export class LastMovedByPillbugViolation extends Data.TaggedError(
  "LastMovedByPillbugViolation"
)<{
  move: Move.BugGameMove;
}> {}

export type SwarmError =
  | SplitSwarm
  | BugNotFound
  | BeetlePressure
  | ImpossibleMove
  | MoveBeforeQueenBeePlacementViolation
  | LastMovedByPillbugViolation
  | IntroductionMoveViolation;
