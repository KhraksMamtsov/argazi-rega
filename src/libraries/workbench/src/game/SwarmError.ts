import { Data } from "effect";
import * as Move from "./Move.ts";
import * as Cell from "./Cell.ts";

export class SplitSwarm extends Data.TaggedError("SplitSwarm")<{
  cell: Cell.Occupied;
}> {}

export class BugNotFound extends Data.TaggedError("BugNotFound")<{
  move: Move.MovingMove;
  type: "neighbor" | "self";
}> {}

export class BeetlePressure extends Data.TaggedError("BeetlePressure")<{
  move: Move.MovingMove;
}> {}

export class ImpossibleMove extends Data.TaggedError("ImpossibleMove")<{
  move: Move.MovingMove;
}> {}
export class IntroductionMoveViolation extends Data.TaggedError(
  "IntroductionMoveViolation"
)<{
  move: Move.MovingMove;
}> {}
export class MoveBeforeQueenBeePlacementViolation extends Data.TaggedError(
  "MoveBeforeQueenBeePlacementViolation"
)<{
  move: Move.MovingMove;
}> {}

export type SwarmError =
  | SplitSwarm
  | BugNotFound
  | BeetlePressure
  | ImpossibleMove
  | MoveBeforeQueenBeePlacementViolation
  | IntroductionMoveViolation;
