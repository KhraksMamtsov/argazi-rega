import { Data, Array, Option, Pipeable } from "effect";
import * as Bug from "./Bug.ts";
import { dual } from "effect/Function";

export interface SwarmMember extends Pipeable.Pipeable {}
export class SwarmMember<B extends Bug.Bug = Bug.Bug> extends Data.Class<{
  bug: B;
  cover: ReadonlyArray<Bug.Beetle | Bug.Mosquito>;
}> {
  static {
    this.prototype.pipe = function () {
      return Pipeable.pipeArguments(this, arguments);
    };
  }
}

export const Init = (bug: Bug.Bug) => new SwarmMember({ bug, cover: [] });

export const bugFromLevel = <B extends Bug.Bug = Bug.Bug>(
  sm: SwarmMember<B>,
  level: number
): Option.Option<B | Bug.Mosquito | Bug.Beetle> =>
  level === 0 ? Option.some(sm.bug) : Array.get(sm.cover, level - 1);

export const addCover: {
  <B extends Bug.Bug>(
    swarmMember: SwarmMember<B>,
    beetleOrMosquito: Bug.Beetle | Bug.Mosquito
  ): SwarmMember<B>;
  (
    beetleOrMosquito: Bug.Beetle | Bug.Mosquito
  ): <B extends Bug.Bug>(swarmMember: SwarmMember<B>) => SwarmMember<B>;
} = dual(
  2,
  <B extends Bug.Bug>(
    swarmMember: SwarmMember<B>,
    beetleOrMosquito: Bug.Beetle | Bug.Mosquito
  ): SwarmMember<B> =>
    new SwarmMember({
      bug: swarmMember.bug,
      cover: [...swarmMember.cover, beetleOrMosquito],
    })
);

export const popBug = (
  swarmMember: SwarmMember
): readonly [Bug.Bug, Option.Option<SwarmMember>] => {
  if (Array.isNonEmptyReadonlyArray(swarmMember.cover)) {
    return [
      Array.lastNonEmpty(swarmMember.cover),
      Option.some(
        new SwarmMember({
          bug: swarmMember.bug,
          cover: Array.initNonEmpty(swarmMember.cover),
        })
      ),
    ];
  } else {
    return [swarmMember.bug, Option.none()];
  }
};
