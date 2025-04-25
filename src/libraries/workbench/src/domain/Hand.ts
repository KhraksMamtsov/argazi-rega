import { HashSet, Option, Array, String, Schema } from "effect";
import * as Bug from "./Bug.ts";
import * as Side from "./Side.ts";
import { dual } from "effect/Function";
import { BugDto } from "../api/Bug.dto.ts";

export class Hand extends Schema.Class<Hand>("Hand")({
  bugs: Schema.HashSet(BugDto),
  side: Side.SideSchema,
}) {}

export const Init = (
  side: Side.Side,
  option: {
    mosquito: boolean;
    ladybug: boolean;
    pillbug: boolean;
  }
) =>
  new Hand({
    side,
    bugs: HashSet.fromIterable([
      Bug.QueenBee.Init(side),
      ...Bug.Beetle.Init(side),
      ...Bug.Spider.Init(side),
      ...Bug.Ant.Init(side),
      ...Bug.Grasshopper.Init(side),
      ...(option.ladybug ? Bug.Ladybug.Init(side) : []),
      ...(option.mosquito ? Bug.Mosquito.Init(side) : []),
      ...(option.pillbug ? Bug.Pillbug.Init(side) : []),
    ]),
  });

export const isWithQueenBee = (hand: Hand) =>
  HashSet.has(hand.bugs, Bug.QueenBee.Init(hand.side));

export const containsBug: {
  (bug: Bug.Bug): (hand: Hand) => boolean;
  (hand: Hand, bug: Bug.Bug): boolean;
} = dual(2, (hand: Hand, bug: Bug.Bug) => HashSet.has(hand.bugs, bug));
export const extractBug: {
  <B extends Bug.Bug>(bug: B): (hand: Hand) => [Option.Option<B>, Hand];
  <B extends Bug.Bug>(hand: Hand, bug: B): [Option.Option<B>, Hand];
} = dual(2, <B extends Bug.Bug>(hand: Hand, bug: B) => {
  if (containsBug(hand, bug)) {
    return [
      Option.some(bug),
      new Hand({
        bugs: HashSet.remove(hand.bugs, bug),
        side: hand.side,
      }),
    ];
  } else {
    return [Option.none(), hand];
  }
});

export const isEmpty = (hand: Hand) => HashSet.size(hand.bugs) === 0;

export const toString = (hand: Hand) =>
  Side.toString(hand.side) +
  ": " +
  HashSet.map(hand.bugs, (x) => x._tag[0]! + x.number.toString())
    .pipe(HashSet.toValues, Array.sort(String.Order))
    .join(" ");
