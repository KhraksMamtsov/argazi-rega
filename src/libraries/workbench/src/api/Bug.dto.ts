import { Schema } from "effect";
import * as Bug from "../game/Bug.ts";
import * as BugNumber from "../game/BugNumber.ts";
import { SideDto } from "./Side.dto.ts";

// #region common
const One = Schema.Literal(...BugNumber._One);
const OneTwo = Schema.Literal(...BugNumber._OneTwo);
const OneTwoThree = Schema.Literal(...BugNumber._OneTwoThree);
// #region

// #region QueenBeeDto
const QUEEN_BEE_SIGN = "Q";

export const _QueenBeeDto = Schema.TemplateLiteralParser(
  SideDto,
  Schema.Literal(QUEEN_BEE_SIGN),
  One
).annotations({
  identifier: "_QueenBeeDto",
});

export class QueenBeeDto extends Schema.transform(_QueenBeeDto, Bug.QueenBee, {
  strict: true,
  decode: ([side, _, number]) => new Bug.QueenBee({ side, number }),
  encode: (b) => [b.side, QUEEN_BEE_SIGN, b.number] as const,
}).annotations({
  identifier: "QueenBeeDto",
}) {}

// #endregion QueenBeeDto

// #region BeetleDto
const BEETLE_SIGN = "B";

export const _BeetleDto = Schema.TemplateLiteralParser(
  SideDto,
  Schema.Literal(BEETLE_SIGN),
  OneTwo
).annotations({
  identifier: "_BeetleDto",
});

export class BeetleDto extends Schema.transform(_BeetleDto, Bug.Beetle, {
  strict: true,
  decode: ([side, _, number]) => new Bug.Beetle({ side, number }),
  encode: (b) => [b.side, BEETLE_SIGN, b.number] as const,
}).annotations({
  identifier: "BeetleDto",
}) {}
// #endregion BeetleDto

// #region SpiderDto
const SPIDER_SIGN = "S";

export const _SpiderDto = Schema.TemplateLiteralParser(
  SideDto,
  Schema.Literal(SPIDER_SIGN),
  OneTwo
).annotations({
  identifier: "_SpiderDto",
});

export class SpiderDto extends Schema.transform(_SpiderDto, Bug.Spider, {
  strict: true,
  decode: ([side, _, number]) => new Bug.Spider({ side, number }),
  encode: (b) => [b.side, SPIDER_SIGN, b.number] as const,
}).annotations({
  identifier: "SpiderDto",
}) {}
// #endregion BeetleDto

// #region AntDto
const ANT_SIGN = "A";

export const _AntDto = Schema.TemplateLiteralParser(
  SideDto,
  Schema.Literal(ANT_SIGN),
  OneTwoThree
).annotations({
  identifier: "_AntDto",
});

export class AntDto extends Schema.transform(_AntDto, Bug.Ant, {
  strict: true,
  decode: ([side, _, number]) => new Bug.Ant({ side, number }),
  encode: (b) => [b.side, ANT_SIGN, b.number] as const,
}).annotations({
  identifier: "AntDto",
}) {}
// #endregion BeetleDto

// #region GrasshopperDto
const GRASSHOPPER_SIGN = "G";

export const _GrasshopperDto = Schema.TemplateLiteralParser(
  SideDto,
  Schema.Literal(GRASSHOPPER_SIGN),
  OneTwoThree
).annotations({
  identifier: "_GrasshopperDto",
});

export class GrasshopperDto extends Schema.transform(
  _GrasshopperDto,
  Bug.Grasshopper,
  {
    strict: true,
    decode: ([side, _, number]) => new Bug.Grasshopper({ side, number }),
    encode: (b) => [b.side, GRASSHOPPER_SIGN, b.number] as const,
  }
).annotations({
  identifier: "GrasshopperDto",
}) {}
// #endregion BeetleDto

// #region BugDto
export class BugDto extends Schema.Union(
  QueenBeeDto,
  BeetleDto,
  SpiderDto,
  AntDto,
  GrasshopperDto
).annotations({
  identifier: "BugDto",
}) {
  static encodeSync = Schema.encodeSync(BugDto);
}
// #endregion
