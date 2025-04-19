import { Data, HashSet, Option } from "effect";
import * as Bug from "./Bug.ts";
import * as Side from "./Side.ts";
import { dual } from "effect/Function";

export class Hand extends Data.Class<{
  bugs: HashSet.HashSet<Bug.Bug>;
  side: Side.Side;
}> {}

export const Init = (side: Side.Side) =>
  new Hand({
    side,
    bugs: HashSet.fromIterable([
      Bug.QueenBee.Init(side),
      ...Bug.Beetle.Init(side),
      ...Bug.Spider.Init(side),
      ...Bug.Ant.Init(side),
      ...Bug.Grasshopper.Init(side),
    ]),
  });

export const isWithQueenBee = (hand: Hand) =>
  HashSet.has(hand.bugs, Bug.QueenBee.Init(hand.side));

export const extractBug: {
  <B extends Bug.Bug>(bug: B): (hand: Hand) => [Option.Option<B>, Hand];
  <B extends Bug.Bug>(hand: Hand, bug: B): [Option.Option<B>, Hand];
} = dual(2, <B extends Bug.Bug>(hand: Hand, bug: B) => {
  if (HashSet.has(hand.bugs, bug)) {
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
  ":" +
  HashSet.map(hand.bugs, (x) => x._tag[0]! + x.number.toString())
    .pipe(HashSet.toValues)
    .join(" ");
