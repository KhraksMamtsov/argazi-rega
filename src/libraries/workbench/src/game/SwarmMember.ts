import { Data } from "effect";
import * as Bug from "./Bug.ts";

export class SwarmMember<B extends Bug.Bug = Bug.Bug> extends Data.Class<{
  bug: B;
  beetles: ReadonlyArray<Bug.Beetle>;
}> {}

export const Init = (bug: Bug.Bug) => new SwarmMember({ bug, beetles: [] });
export const bugs = (swarmMember: SwarmMember) =>
  1 + swarmMember.beetles.length;
