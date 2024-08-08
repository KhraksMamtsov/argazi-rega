import { Schema } from "@effect/schema";
import { Data, Effect, Either, pipe } from "effect";

import { UserDbToDomain } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";
import type { User } from "@argazi/domain";

import type { BaseCausedCommand, BaseCommand } from "./Base.command.js";

export enum BaseUseCaseErrorTag {
  UNKNOWN_INITIATOR = "UNKNOWN_INITIATOR::BaseUseCaseErrorTag",
}

export class UnknownInitiatorBaseUseCaseError extends Data.TaggedClass(
  BaseUseCaseErrorTag.UNKNOWN_INITIATOR
)<{
  readonly command: BaseCausedCommand;
}> {}

export const BaseCausedUseCaseFor =
  <SR, I, T extends BaseCausedCommand>(
    _commandSchema: Schema.Schema<T, I, SR>
  ) =>
  <R, E, A>(
    cb: (args: {
      readonly initiator: User;
      readonly payload: T["payload"];
    }) => Effect.Effect<A, E, R>
  ) =>
  (command: T) =>
    Effect.gen(function* () {
      const prismaService = yield* PrismaServiceTag;

      const initiator = yield* pipe(
        prismaService.queryDecode(
          Schema.OptionFromNullOr(UserDbToDomain),
          (p) => p.user.findUnique({ where: { id: command.idInitiator } })
        ),
        Effect.flatMap(
          Either.fromOption(
            () => new UnknownInitiatorBaseUseCaseError({ command })
          )
        )
      );

      return yield* cb({
        initiator,
        payload: command.payload,
      });
    });

export const BaseGetCausedUseCaseFor =
  <SR, I, T extends BaseCausedCommand>(
    _commandSchema: Schema.Schema<T, I, SR>
  ) =>
  <R, E, A>(
    cb: (
      args: {
        readonly initiator: User;
        readonly payload: T["payload"];
      },
      options: {
        readonly includeDeleted: boolean;
      }
    ) => Effect.Effect<A, E, R>
  ) =>
  (
    command: T,
    options: {
      readonly includeDeleted: boolean;
    }
  ) =>
    Effect.gen(function* () {
      const prismaService = yield* PrismaServiceTag;

      const initiator = yield* pipe(
        prismaService.queryDecode(
          Schema.OptionFromNullOr(UserDbToDomain),
          (p) => p.user.findUnique({ where: { id: command.idInitiator } })
        ),
        Effect.flatMap(
          Either.fromOption(
            () => new UnknownInitiatorBaseUseCaseError({ command })
          )
        )
      );

      return yield* cb(
        {
          initiator,
          payload: command.payload,
        },
        options
      );
    });

export const BaseUseCaseFor =
  <SR, I, T extends BaseCommand>(commandSchema: Schema.Schema<T, I, SR>) =>
  <R, E, A>(cb: (args: T) => Effect.Effect<A, E, R>) =>
  (command: I) =>
    Effect.gen(function* () {
      const args = yield* Schema.decode(commandSchema)(command);
      return yield* cb(args);
    });
