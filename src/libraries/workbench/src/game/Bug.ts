import { Data, Predicate, Tuple } from "effect";
import { Schema } from "effect";
import * as Side from "./Side.ts";
import * as BugNumber from "./BugNumber.ts";
import { dual } from "effect/Function";

export class _Bug extends Schema.Struct({
  side: Side.SideSchema,
}) {}

export class QueenBee extends Schema.TaggedClass<QueenBee>("QueenBee")(
  "QueenBee",
  { ..._Bug.fields, number: Schema.Literal(...BugNumber._One) }
) {
  static Init(side: Side.Side) {
    return new QueenBee({ number: BugNumber._One[0], side });
  }
}

export class Beetle extends Schema.TaggedClass<Beetle>("Beetle")("Beetle", {
  ..._Bug.fields,
  number: Schema.Literal(...BugNumber._OneTwo),
}) {
  static Init = (side: Side.Side) =>
    Tuple.map(BugNumber._OneTwo, (number) => new Beetle({ number, side }));
}

export class Grasshopper extends Schema.TaggedClass<Grasshopper>("Grasshopper")(
  "Grasshopper",
  {
    ..._Bug.fields,
    number: Schema.Literal(...BugNumber._OneTwoThree),
  }
) {
  static Init(side: Side.Side) {
    return Tuple.map(
      BugNumber._OneTwoThree,
      (number) => new Grasshopper({ number, side })
    );
  }
}

export class Spider extends Schema.TaggedClass<Spider>("Spider")("Spider", {
  ..._Bug.fields,
  number: Schema.Literal(...BugNumber._OneTwo),
}) {
  static Init(side: Side.Side) {
    return Tuple.map(
      BugNumber._OneTwo,
      (number) => new Spider({ number, side })
    );
  }
}

export class Ant extends Schema.TaggedClass<Ant>("Ant")("Ant", {
  ..._Bug.fields,
  number: Schema.Literal(...BugNumber._OneTwoThree),
}) {
  static Init(side: Side.Side) {
    return Tuple.map(
      BugNumber._OneTwoThree,
      (number) => new Ant({ number, side })
    );
  }
}

export class Ladybug extends Schema.TaggedClass<Ladybug>("Ladybug")(
  "Ladybug",

  { ..._Bug.fields, number: Schema.Literal(...BugNumber._One) }
) {
  static Init(side: Side.Side) {
    return new Ladybug({ number: BugNumber._One[0], side });
  }
}

export class Mosquito extends Schema.TaggedClass<Mosquito>("Mosquito")(
  "Mosquito",
  { ..._Bug.fields, number: Schema.Literal(...BugNumber._One) }
) {
  static Init(side: Side.Side) {
    return new Mosquito({ number: BugNumber._One[0], side });
  }
}

export class Pillbug extends Schema.TaggedClass<Pillbug>("Pillbug")("Pillbug", {
  ..._Bug.fields,
  number: Schema.Literal(...BugNumber._OneTwo),
}) {
  static Init(side: Side.Side) {
    return Tuple.map(
      BugNumber._OneTwo,
      (number) => new Pillbug({ number, side })
    );
  }
}

export const BugSchema = Schema.Union(
  QueenBee,
  Beetle,
  Grasshopper,
  Spider,
  Ant,
  Ladybug,
  Mosquito,
  Pillbug
);
export type Bug = typeof BugSchema.Type;

const Bug = Data.taggedEnum<Bug>();

export const refineNotQueen = (bug: Bug): bug is Exclude<Bug, QueenBee> =>
  Predicate.not(refineQueen)(bug);

export const match = Bug.$match;
// export const refine = Bug.$is;
export const refine: {
  <T extends Bug["_tag"]>(
    tag: T
  ): (bug: Bug) => bug is Extract<Bug, { _tag: T }>;
  <T extends Bug["_tag"]>(bug: Bug, tag: T): bug is Extract<Bug, { _tag: T }>;
} = dual(
  2,
  <T extends Bug["_tag"]>(
    bug: Bug,
    tag: T
  ): bug is Extract<Bug, { _tag: T }> => {
    console.log(tag, bug);
    return Bug.$is(tag)(bug);
  }
);

export const refineQueen = refine("QueenBee");

export const emoji = Bug.$match({
  Ant: () => "🐜",
  QueenBee: () => "🐝",
  Beetle: () => "🪲",
  Grasshopper: () => "🦗",
  Spider: () => "🕷",
  Ladybug: () => "🐞",
  Mosquito: () => "🦟",
  Pillbug: () => "🪱",
});

const one = "\u030A";
const two = "\u0308";
const three = one + two;
const numberMap = ["", one, two, three] as const;
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

export const symbol = (bug: Bug) => {
  return symbolMap[bug._tag] + numberMap[bug.number] + colorMap[bug.side];
};
