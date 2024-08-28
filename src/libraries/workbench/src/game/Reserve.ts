import { Data } from "effect";
import type { Bug } from "./Bug.ts";

export class Reserve extends Data.TaggedClass("Reserve")<{
  reserve: Map<Bug, number>;
}> {}
