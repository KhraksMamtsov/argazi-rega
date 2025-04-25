import { Schema, hole } from "effect";
import { BugDto } from "./Bug.dto.ts";
import * as _Move from "../domain/GameMove.ts";
import * as _Bug from "../domain/Bug.ts";
import * as Side from "../domain/Side.ts";
import type { CellBorder } from "../domain/CellBorder.ts";

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
  Side.SideSchema,
  Schema.Literal(": "),
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
  Schema.typeSchema(_Move.BugGameMove),
  {
    strict: true,
    decode: ([side, __, bug, _, target]) => {
      let neighbor: _Bug.Bug;
      let cellBorder: CellBorder;
      if (typeof target[0] === "number") {
        [cellBorder, neighbor] = target;
      } else {
        [neighbor, cellBorder] = target;
      }

      return new _Move.BugGameMove({
        bug,
        cellBorder,
        neighbor,
        side,
      });
    },
    encode: (d) => {
      if (d.cellBorder === 0 || d.cellBorder === 1 || d.cellBorder === 2) {
        return [d.side, ": ", d.bug, " ", [d.neighbor, d.cellBorder]] as const;
      } else {
        return [d.side, ": ", d.bug, " ", [d.cellBorder, d.neighbor]] as const;
      }
    },
  }
).annotations({
  identifier: "MovingMoveDto",
}) {
  static decode = Schema.decodeSync(this);
}

export class InitialMoveDto extends Schema.transform(
  BugDto,
  Schema.typeSchema(_Move.InitialGameMove),
  {
    strict: true,
    encode: (x) => x.bug,
    decode: (bug) => new _Move.InitialGameMove({ bug }),
  }
).annotations({
  identifier: "InitialMoveDto",
}) {
  static decode = Schema.decodeSync(this);
}

export class MoveDto extends Schema.Union(
  MovingMoveDto,
  InitialMoveDto
).annotations({
  identifier: "MoveDto",
}) {
  static decode = Schema.decodeSync(this);
}
