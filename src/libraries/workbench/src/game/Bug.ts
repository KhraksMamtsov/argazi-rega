import { Data } from "effect";
import { Schema } from "@effect/schema";
import * as Side from "./Side.ts";

export class QueenBee extends Schema.TaggedClass<QueenBee>()("QueenBee", {
  side: Side._Side,
}) {}

export class Beetle extends Schema.TaggedClass<Beetle>()("Beetle", {
  side: Side._Side,
  number: Schema.Literal(1, 2),
}) {}

export class Grasshopper extends Schema.TaggedClass<Grasshopper>()(
  "Grasshopper",
  {
    side: Side._Side,
    number: Schema.Literal(1, 2, 3),
  }
) {}

export class Spider extends Schema.TaggedClass<Spider>()("Spider", {
  side: Side._Side,
  number: Schema.Literal(1, 2),
}) {}

export class Ant extends Schema.TaggedClass<Ant>()("Ant", {
  side: Side._Side,
  number: Schema.Literal(1, 2, 3),
}) {}

export class Ladybug extends Schema.TaggedClass<Ladybug>()("Ladybug", {
  side: Side._Side,
}) {}

export class Mosquito extends Schema.TaggedClass<Mosquito>()("Mosquito", {
  side: Side._Side,
}) {}

export class Pillbug extends Schema.TaggedClass<Pillbug>()("Pillbug", {
  side: Side._Side,
}) {}

export type Bug = QueenBee | Beetle | Grasshopper | Spider | Ant;
// | Ladybug
// | Mosquito
// | Pillbug;

export const Bug = Data.taggedEnum<Bug>();
