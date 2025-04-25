import { Array, Option, Pipeable, Schema } from "effect";
import * as Bug from "./Bug.ts";
import { dual } from "effect/Function";

export interface SwarmMember extends Pipeable.Pipeable {}

export declare namespace SwarmMember {
  export type With<B extends Bug.Bug> = SwarmMember & { readonly bug: B };
}
export class SwarmMember extends Schema.Class<SwarmMember>("SwarmMember")({
  bug: Bug.BugSchema,
  cover: Schema.Array(Schema.Union(Bug.Beetle, Bug.Mosquito)),
}) {
  static {
    this.prototype.pipe = function () {
      return Pipeable.pipeArguments(this, arguments);
    };
  }
  static With<B extends Bug.Bug>(
    params: ConstructorParameters<typeof SwarmMember>[0] & { bug: B }
  ): SwarmMember.With<B> {
    return new SwarmMember(params) as SwarmMember.With<B>;
  }
}

export const Init = (bug: Bug.Bug) => new SwarmMember({ bug, cover: [] });

export const bugFromLevel = <B extends Bug.Bug = Bug.Bug>(
  sm: SwarmMember.With<B>,
  level: number
): Option.Option<B | Bug.Mosquito | Bug.Beetle> =>
  level === 0 ? Option.some(sm.bug) : Array.get(sm.cover, level - 1);

export const addCover: {
  <B extends Bug.Bug>(
    swarmMember: SwarmMember.With<B>,
    beetleOrMosquito: Bug.Beetle | Bug.Mosquito
  ): SwarmMember.With<B>;
  (
    beetleOrMosquito: Bug.Beetle | Bug.Mosquito
  ): <B extends Bug.Bug>(
    swarmMember: SwarmMember.With<B>
  ) => SwarmMember.With<B>;
} = dual(
  2,
  <B extends Bug.Bug>(
    swarmMember: SwarmMember.With<B>,
    beetleOrMosquito: Bug.Beetle | Bug.Mosquito
  ): SwarmMember.With<B> =>
    SwarmMember.With({
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
