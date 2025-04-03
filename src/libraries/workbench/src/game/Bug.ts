import { Data, Predicate, Tuple } from "effect";
import { Schema } from "effect";
import * as Side from "./Side.ts";
import { aN } from "vitest/dist/chunks/reporters.d.CfRkRKN2.js";

export const OneTwo = [1, 2] as const;
export const OneTwoThree = [...OneTwo, 3] as const;

class _Bug extends Schema.Struct({
  side: Side._Side,
}) {}

export class QueenBee extends Schema.TaggedClass<QueenBee>("QueenBee")(
  "QueenBee",
  { ..._Bug.fields }
) {
  static Init(side: Side.Side) {
    return new QueenBee({ side });
  }
}

export class Beetle extends Schema.TaggedClass<Beetle>("Beetle")("Beetle", {
  ..._Bug.fields,
  number: Schema.Literal(...OneTwo),
}) {
  static Init(side: Side.Side) {
    return Tuple.map(OneTwo, (number) => new Beetle({ number, side }));
  }
}

export class Grasshopper extends Schema.TaggedClass<Grasshopper>("Grasshopper")(
  "Grasshopper",
  {
    ..._Bug.fields,
    number: Schema.Literal(...OneTwoThree),
  }
) {
  static Init(side: Side.Side) {
    return Tuple.map(
      OneTwoThree,
      (number) => new Grasshopper({ number, side })
    );
  }
}

export class Spider extends Schema.TaggedClass<Spider>("Spider")("Spider", {
  ..._Bug.fields,
  number: Schema.Literal(...OneTwo),
}) {
  static Init(side: Side.Side) {
    return Tuple.map(OneTwo, (number) => new Spider({ number, side }));
  }
}

export class Ant extends Schema.TaggedClass<Ant>("Ant")("Ant", {
  ..._Bug.fields,
  number: Schema.Literal(...OneTwoThree),
}) {
  static Init(side: Side.Side) {
    return Tuple.map(OneTwoThree, (number) => new Ant({ number, side }));
  }
}

export class Ladybug extends Schema.TaggedClass<Ladybug>("Ladybug")("Ladybug", {
  ..._Bug.fields,
}) {}

export class Mosquito extends Schema.TaggedClass<Mosquito>("Mosquito")(
  "Mosquito",
  { ..._Bug.fields }
) {}

export class Pillbug extends Schema.TaggedClass<Pillbug>("Pillbug")("Pillbug", {
  ..._Bug.fields,
}) {}

export type Bug = QueenBee | Beetle | Grasshopper | Spider | Ant;
// | Ladybug
// | Mosquito
// | Pillbug;

export const Bug = Data.taggedEnum<Bug>();

export const refineQueen = (bug: Bug): bug is QueenBee =>
  Bug.$is("QueenBee")(bug);

export const refineNotQueen = (bug: Bug): bug is Exclude<Bug, QueenBee> =>
  Predicate.not(refineQueen)(bug);

export const emoji = Bug.$match({
  Ant: () => "🐜",
  QueenBee: () => "🐝",
  Beetle: () => "🪲",
  Grasshopper: () => "🦗",
  Spider: () => "🕷",
  // 🦟 🐞 🪱
});

const one = "\u030A";
const two = "\u0308";
const three = two + one;
const symbols_ = ["", one, two, three] as const;

export const symbol = Bug.$match({
  Ant: ({ number }) => "A" + symbols_[number],
  QueenBee: () => "Q",
  Beetle: ({ number }) => "B" + symbols_[number],
  Grasshopper: ({ number }) => "G" + symbols_[number],
  Spider: ({ number }) => "S" + symbols_[number],
  // 🦟 🐞 🪱
});
