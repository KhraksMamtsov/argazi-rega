import { Brand, Data, Predicate } from "effect";
import { Schema } from "effect";
import * as Side from "./Side.js";
import * as BugNumber from "./BugNumber.js";
import { dual } from "effect/Function";

export class BugBase extends Schema.Struct({
  side: Side.SideSchema,
}) {}

export class QueenBee extends Schema.TaggedClass<QueenBee>("QueenBee")(
  "QueenBee",
  { ...BugBase.fields, number: BugNumber.One }
) {
  static Init(side: Side.Side) {
    return new QueenBee({ number: BugNumber.One.make(1), side });
  }
}

export class Beetle extends Schema.TaggedClass<Beetle>("Beetle")("Beetle", {
  ...BugBase.fields,
  number: BugNumber.OneTwo,
}) {
  static Init = (side: Side.Side) => [
    new Beetle({ number: BugNumber.One.make(1), side }),
    new Beetle({ number: BugNumber.Two.make(2), side }),
  ];
}

export class Grasshopper extends Schema.TaggedClass<Grasshopper>("Grasshopper")(
  "Grasshopper",
  {
    ...BugBase.fields,
    number: BugNumber.BugNumber,
  }
) {
  static Init = (side: Side.Side) => [
    new Grasshopper({ number: BugNumber.One.make(1), side }),
    new Grasshopper({ number: BugNumber.Two.make(2), side }),
    new Grasshopper({ number: BugNumber.Three.make(3), side }),
  ];
}

export class Spider extends Schema.TaggedClass<Spider>("Spider")("Spider", {
  ...BugBase.fields,
  number: BugNumber.OneTwo,
}) {
  static Init = (side: Side.Side) => [
    new Spider({ number: BugNumber.One.make(1), side }),
    new Spider({ number: BugNumber.Two.make(2), side }),
  ];
}

export class Ant extends Schema.TaggedClass<Ant>("Ant")("Ant", {
  ...BugBase.fields,
  number: BugNumber.BugNumber,
}) {
  static Init = (side: Side.Side) => [
    new Ant({ number: BugNumber.One.make(1), side }),
    new Ant({ number: BugNumber.Two.make(2), side }),
    new Ant({ number: BugNumber.Three.make(3), side }),
  ];
}

export class Ladybug extends Schema.TaggedClass<Ladybug>("Ladybug")(
  "Ladybug",

  { ...BugBase.fields, number: BugNumber.One }
) {
  static Init(side: Side.Side) {
    return new Ladybug({ number: BugNumber.One.make(1), side });
  }
}

export class Mosquito extends Schema.TaggedClass<Mosquito>("Mosquito")(
  "Mosquito",

  { ...BugBase.fields, number: BugNumber.One }
) {
  static Init(side: Side.Side) {
    return new Mosquito({ number: BugNumber.One.make(1), side });
  }
}

export class Pillbug extends Schema.TaggedClass<Pillbug>("Pillbug")("Pillbug", {
  ...BugBase.fields,
  number: BugNumber.One,
}) {
  static Init(side: Side.Side) {
    return new Pillbug({ number: BugNumber.One.make(1), side });
  }
}

export const Bug = Schema.Union(
  QueenBee,
  Beetle,
  Grasshopper,
  Spider,
  Ant,
  Ladybug,
  Mosquito,
  Pillbug
).annotations({
  identifier: "Bug",
});
export type Bug = typeof Bug.Type;

const __Bug = Data.taggedEnum<Bug>();
export const match = __Bug.$match;
export const is = __Bug.$is;

export const refine: {
  <T extends Bug["_tag"]>(
    tag: T
  ): (bug: Bug) => bug is Extract<Bug, { _tag: T }>;
  <T extends Bug["_tag"]>(bug: Bug, tag: T): bug is Extract<Bug, { _tag: T }>;
} = dual(
  2,
  <T extends Bug["_tag"]>(bug: Bug, tag: T): bug is Extract<Bug, { _tag: T }> =>
    is(tag)(bug)
);

export const refineQueen = refine("QueenBee");
export const refineNotQueen = (bug: Bug): bug is Exclude<Bug, QueenBee> =>
  Predicate.not(refineQueen)(bug);

export const emoji = match({
  Ant: () => "🐜",
  QueenBee: () => "🐝",
  Beetle: () => "🪲",
  Grasshopper: () => "🦗",
  Spider: () => "🕷",
  Ladybug: () => "🐞",
  Mosquito: () => "🦟",
  Pillbug: () => "🪱",
});

const underline = "\u0332";

const colorMap: Record<Side.Side, string> = {
  black: underline,
  white: "",
};
const symbolMap: Record<Bug["_tag"], string> = {
  Ant: "A",
  Beetle: "B",
  Grasshopper: "G",
  QueenBee: "Q",
  Spider: "S",
  Ladybug: "L",
  Mosquito: "M",
  Pillbug: "P",
};

const one = "\u030A";
const two = "\u0308";
const three = one + two;
const numberMap = ["", one, two, three] as const;

export const symbol = (bug: Bug) => {
  const { number } = bug;
  const unbranded: Brand.Brand.Unbranded<typeof bug.number> = number;

  return symbolMap[bug._tag] + colorMap[bug.side] + numberMap[unbranded];
};
