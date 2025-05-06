import { Schema } from "effect";

export class SideStr extends Schema.transformLiterals(
  ["w", "white"],
  ["b", "black"]
).annotations({
  identifier: "SideStr",
}) {}
