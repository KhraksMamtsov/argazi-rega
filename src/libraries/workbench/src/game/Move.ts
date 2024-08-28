import { Data } from "effect";
import * as Cell from "./Cell.ts";
import * as Bug from "./Bug.ts";

export class IntroduceMove extends Data.TaggedClass("IntroduceMove")<{
  to: Cell.Empty;
  bug: Bug.Bug;
}> {}

export class MovingMove extends Data.TaggedClass("MovingMove")<{
  to: Cell.Empty;
  from: Cell.Cell;
}> {}

// export class BeetleMove extends Data.TaggedClass("BeetleMove")<{
//   to: Cell.Cell;
//   from: Cell.CellWithBug<Cell.CellBugsWithBeetle>;
// }> {}

export type Move = IntroduceMove | MovingMove;
