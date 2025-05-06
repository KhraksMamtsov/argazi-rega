import { Schema } from "effect";
import { BugStr } from "./Bug.str.js";
import * as _Move from "../domain/GameMove.js";
import * as _Bug from "../domain/Bug.js";
import type { CellBorder } from "../domain/CellBorder.js";
import { SideStr } from "./Side.str.js";

export class CellBorderRightStr extends Schema.transformLiterals(
  ["\\", 0],
  ["|", 1],
  ["/", 2]
).annotations({
  identifier: "CellBorderRightStr",
}) {}

export class CellBorderLeftStr extends Schema.transformLiterals(
  ["/", 5],
  ["|", 4],
  ["\\", 3]
).annotations({
  identifier: "CellBorderLeftStr",
}) {}

export const _MovingMoveStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(": "),
  BugStr,
  Schema.Literal(" "),
  Schema.Union(
    Schema.TemplateLiteralParser(CellBorderLeftStr, BugStr),
    Schema.TemplateLiteralParser(BugStr, CellBorderRightStr)
  )
).annotations({
  identifier: "_MovingMoveStr",
});

export class BugGameMoveStr extends Schema.transform(
  _MovingMoveStr,
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
  identifier: "BugGameMoveStr",
}) {
  static decode = Schema.decodeSync(this);
}

export class InitialGameMoveStr extends Schema.transform(
  BugStr,
  Schema.typeSchema(_Move.InitialGameMove),
  {
    strict: true,
    encode: (x) => x.bug,
    decode: (bug) => new _Move.InitialGameMove({ bug, side: "white" }),
  }
).annotations({
  identifier: "InitialGameMoveStr",
}) {
  static decode = Schema.decodeSync(this);
}

export class GameMoveStr extends Schema.Union(
  BugGameMoveStr,
  InitialGameMoveStr
).annotations({
  identifier: "GameMoveStr",
}) {
  static decode = Schema.decodeSync(this);
}
