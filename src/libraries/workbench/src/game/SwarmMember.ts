import { Data, Array, Option } from "effect";
import * as Bug from "./Bug.ts";
import { dual } from "effect/Function";

export class SwarmMember<B extends Bug.Bug = Bug.Bug> extends Data.Class<{
  bug: B;
  beetles: ReadonlyArray<Bug.Beetle>;
}> {}

export const Init = (bug: Bug.Bug) => new SwarmMember({ bug, beetles: [] });

export const addBeetle: {
  <B extends Bug.Bug>(
    swarmMember: SwarmMember<B>,
    beetle: Bug.Beetle
  ): SwarmMember<B>;
  (
    beetle: Bug.Beetle
  ): <B extends Bug.Bug>(swarmMember: SwarmMember<B>) => SwarmMember<B>;
} = dual(
  2,
  <B extends Bug.Bug>(
    swarmMember: SwarmMember<B>,
    beetle: Bug.Beetle
  ): SwarmMember<B> =>
    new SwarmMember({
      bug: swarmMember.bug,
      beetles: [...swarmMember.beetles, beetle],
    })
);

export const popBug = (
  swarmMember: SwarmMember
): readonly [Bug.Bug, Option.Option<SwarmMember>] => {
  if (Array.isNonEmptyReadonlyArray(swarmMember.beetles)) {
    return [
      Array.lastNonEmpty(swarmMember.beetles),
      Option.some(
        new SwarmMember({
          bug: swarmMember.bug,
          beetles: Array.initNonEmpty(swarmMember.beetles),
        })
      ),
    ];
  } else {
    return [swarmMember.bug, Option.none()];
  }
};
