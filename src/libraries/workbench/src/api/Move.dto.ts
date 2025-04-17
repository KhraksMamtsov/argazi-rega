import { Schema } from "effect";
import { BugDto } from "./Bug.dto.ts";
import * as _Move from "../game/Move.ts";
import * as _Bug from "../game/Bug.ts";
import type { CellBorder } from "../game/CellBorder.ts";

export class CellBorderRightDto extends Schema.transformLiterals(
  ["\\", 0],
  ["|", 1],
  ["/", 2]
).annotations({
  identifier: "CellBorderRightDto",
}) {}

export class CellBorderLeftDto extends Schema.transformLiterals(
  ["/", 5],
  ["|", 4],
  ["\\", 3]
).annotations({
  identifier: "CellBorderLeftDto",
}) {}

export const _MovingMoveDto = Schema.TemplateLiteralParser(
  BugDto,
  Schema.Literal(" "),
  Schema.Union(
    Schema.TemplateLiteralParser(CellBorderLeftDto, BugDto),
    Schema.TemplateLiteralParser(BugDto, CellBorderRightDto)
  )
).annotations({
  identifier: "_MovingMoveDto",
});

export class MovingMoveDto extends Schema.transform(
  _MovingMoveDto,
  Schema.typeSchema(_Move.BugMove),
  {
    strict: true,
    decode: ([bug, _, target]) => {
      let neighbor: _Bug.Bug;
      let cellBorder: CellBorder;
      if (typeof target[0] === "number") {
        [cellBorder, neighbor] = target;
      } else {
        [neighbor, cellBorder] = target;
      }

      return new _Move.BugMove({
        bug,
        cellBorder,
        neighbor,
      });
    },
    encode: (d) => {
      if (d.cellBorder === 0 || d.cellBorder === 1 || d.cellBorder === 2) {
        return [d.bug, " ", [d.neighbor, d.cellBorder]] as const;
      } else {
        return [d.bug, " ", [d.cellBorder, d.neighbor]] as const;
      }
    },
  }
).annotations({
  identifier: "MovingMoveDto",
}) {}

export class InitialMoveDto extends Schema.transform(
  BugDto,
  Schema.typeSchema(_Move.InitialMove),
  {
    strict: true,
    encode: (x) => x.bug,
    decode: (bug) => new _Move.InitialMove({ bug }),
  }
).annotations({
  identifier: "InitialMoveDto",
}) {}

export class MoveDto extends Schema.Union(
  MovingMoveDto,
  InitialMoveDto
).annotations({
  identifier: "MoveDto",
}) {}
