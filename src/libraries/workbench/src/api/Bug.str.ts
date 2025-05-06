import { Schema } from "effect";
import * as Bug from "../domain/Bug.js";
import * as BugNumber from "../domain/BugNumber.js";

import type { AssertTrue, IsExtends } from "../shared/effect/Types.js";
import { SideStr } from "./Side.str.js";

// #region common
const One = BugNumber.One;
const OneTwo = Schema.Union(One, BugNumber.Two);
const OneTwoThree = Schema.Union(OneTwo, BugNumber.Three);
// #region

// #region QueenBeeStr
const QUEEN_BEE_SIGN = "Q";

export const _QueenBeeStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(QUEEN_BEE_SIGN),
  Schema.encodedSchema(One)
).annotations({ identifier: "_QueenBeeStr" });

export class QueenBeeStr extends Schema.transform(_QueenBeeStr, Bug.QueenBee, {
  strict: true,
  decode: ([side, _, number]) => ({ side, number, _tag: "QueenBee" }) as const,
  encode: (b) => [b.side, QUEEN_BEE_SIGN, b.number] as const,
}).annotations({ identifier: "QueenBeeStr" }) {}

// #endregion QueenBeeStr

// #region LadybugStr
const LADYBUG_SIGN = "L";

export const _LadybugStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(LADYBUG_SIGN),
  Schema.encodedSchema(One)
).annotations({
  identifier: "_LadybugStr",
});

export class LadybugStr extends Schema.transform(_LadybugStr, Bug.Ladybug, {
  strict: true,
  decode: ([side, _, number]) => ({ side, number, _tag: "Ladybug" }) as const,
  encode: (b) => [b.side, LADYBUG_SIGN, b.number] as const,
}).annotations({
  identifier: "LadybugStr",
}) {}

// #endregion LadybugStr

// #region MosquitoStr
const MOSQUITO_SIGN = "M";

export const _MosquitoStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(MOSQUITO_SIGN),
  Schema.encodedSchema(One)
).annotations({
  identifier: "_MosquitoStr",
});

export class MosquitoStr extends Schema.transform(_MosquitoStr, Bug.Mosquito, {
  strict: true,
  decode: ([side, _, number]) => ({ side, number, _tag: "Mosquito" }) as const,
  encode: (b) => [b.side, MOSQUITO_SIGN, b.number] as const,
}).annotations({
  identifier: "MosquitoStr",
}) {}

// #endregion MosquitoStr

// #region BeetleStr
const BEETLE_SIGN = "B";

export const _BeetleStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(BEETLE_SIGN),
  Schema.encodedSchema(OneTwo)
).annotations({
  identifier: "_BeetleStr",
});

export class BeetleStr extends Schema.transform(_BeetleStr, Bug.Beetle, {
  strict: true,
  decode: ([side, _, number]) => ({ side, number, _tag: "Beetle" }) as const,
  encode: (b) => [b.side, BEETLE_SIGN, b.number] as const,
}).annotations({
  identifier: "BeetleStr",
}) {}
// #endregion BeetleStr

// #region SpiderStr
const SPIDER_SIGN = "S";

export const _SpiderStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(SPIDER_SIGN),
  Schema.encodedSchema(OneTwo)
).annotations({
  identifier: "_SpiderStr",
});

export class SpiderStr extends Schema.transform(_SpiderStr, Bug.Spider, {
  strict: true,
  decode: ([side, _, number]) => ({ side, number, _tag: "Spider" }) as const,
  encode: (b) => [b.side, SPIDER_SIGN, b.number] as const,
}).annotations({
  identifier: "SpiderStr",
}) {}
// #endregion SpiderStr

// #region PillbugStr
const PILLBUG_SIGN = "P";

export const _PillbugStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(PILLBUG_SIGN),
  Schema.encodedSchema(One)
).annotations({
  identifier: "_PillbugStr",
});

export class PillbugStr extends Schema.transform(_PillbugStr, Bug.Pillbug, {
  strict: true,
  decode: ([side, _, number]) => ({ side, number, _tag: "Pillbug" }) as const,
  encode: (b) => [b.side, PILLBUG_SIGN, b.number] as const,
}).annotations({
  identifier: "PillbugStr",
}) {}
// #endregion PillbugStr

// #region AntStr
const ANT_SIGN = "A";

export const _AntStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(ANT_SIGN),
  Schema.encodedSchema(OneTwoThree)
).annotations({
  identifier: "_AntStr",
});

export class AntStr extends Schema.transform(_AntStr, Bug.Ant, {
  strict: true,
  decode: ([side, _, number]) => ({ side, number, _tag: "Ant" }) as const,
  encode: (b) => [b.side, ANT_SIGN, b.number] as const,
}).annotations({
  identifier: "AntStr",
}) {}
// #endregion BeetleStr

// #region GrasshopperStr
const GRASSHOPPER_SIGN = "G";

export const _GrasshopperStr = Schema.TemplateLiteralParser(
  SideStr,
  Schema.Literal(GRASSHOPPER_SIGN),
  Schema.encodedSchema(OneTwoThree)
).annotations({
  identifier: "_GrasshopperStr",
});

export class GrasshopperStr extends Schema.transform(
  _GrasshopperStr,
  Bug.Grasshopper,
  {
    strict: true,
    decode: ([side, _, number]) =>
      ({ side, number, _tag: "Grasshopper" }) as const,
    encode: (b) => [b.side, GRASSHOPPER_SIGN, b.number] as const,
  }
).annotations({
  identifier: "GrasshopperStr",
}) {}
// #endregion BeetleStr

// #region BugStr
export class BugStr extends Schema.Union(
  QueenBeeStr,
  BeetleStr,
  SpiderStr,
  AntStr,
  GrasshopperStr,
  LadybugStr,
  MosquitoStr,
  PillbugStr
).annotations({
  identifier: "BugStr",
}) {
  static encodeSync = Schema.encodeSync(this);
  static decode = Schema.decodeSync(this);
}
// #endregion

export const AllBugs = [
  "wQ1",
  "bQ1",
  "wB2",
  "wB1",
  "bB2",
  "bB1",
  "wS2",
  "wS1",
  "bS2",
  "bS1",
  "wA2",
  "wA1",
  "wA3",
  "bA2",
  "bA1",
  "bA3",
  "wG2",
  "wG1",
  "wG3",
  "bG2",
  "bG1",
  "bG3",
  "wL1",
  "bL1",
  "wM1",
  "bM1",
  "wP1",
  "bP1",
] as const satisfies ReadonlyArray<typeof BugStr.Encoded>;

export type _TypeTestCheckLength = AssertTrue<
  IsExtends<typeof AllBugs.length, 28>
>;

export type _TypeTestCheckUniqness = AssertTrue<
  IsExtends<typeof BugStr.Encoded, (typeof AllBugs)[number]>
>;
