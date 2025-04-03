import { Schema } from "effect";
import { BugDto } from "./Bug.dto.ts";
import * as _Move from "../game/Move.ts";

export class CellBorderDto extends Schema.Literal(0, 1, 2, 3, 4, 5).annotations(
  {
    identifier: "CellBorderDto",
  }
) {}

export class MovingMoveDto extends Schema.TaggedClass<MovingMoveDto>(
  "MovingMoveDto"
)("MovingMoveDto", {
  bug: BugDto,
  neighbor: BugDto,
  cellBorder: CellBorderDto,
}) {}

export class InitialMoveDto extends Schema.TaggedClass<InitialMoveDto>(
  "InitialMoveDto"
)("InitialMoveDto", {
  bug: BugDto,
}) {}

export class MoveDto extends Schema.Union(
  MovingMoveDto,
  InitialMoveDto
).annotations({
  identifier: "MoveDto",
}) {}
