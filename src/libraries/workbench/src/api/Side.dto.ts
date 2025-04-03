import { Schema } from "effect";
import * as Side from "../game/Side.ts";
import type { ReadonlyRecord } from "effect/Record";

class _SideDto extends Schema.Literal("w", "b").annotations({
  identifier: "_SideDto",
}) {}

const Dto2Domain: ReadonlyRecord<typeof _SideDto.Encoded, Side.Side> = {
  w: Side.Side.White,
  b: Side.Side.Black,
};
const Domain2Dto: ReadonlyRecord<Side.Side, typeof _SideDto.Encoded> = {
  [Side.Side.White]: "w",
  [Side.Side.Black]: "b",
};

export class S2ide extends Schema.transform(_SideDto, Side._Side, {
  strict: true,
  decode: (wb) => Dto2Domain[wb],
  encode: (side) => Domain2Dto[side],
}) {}

export class SideDto extends Schema.transformLiterals(
  ["w", Side.Side.White],
  ["b", Side.Side.Black]
).annotations({
  identifier: "SideDto",
}) {}
