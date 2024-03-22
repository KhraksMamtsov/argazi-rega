import { UserDbToDomainSchema } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";
import { Schema } from "@effect/schema";
import { Data, Effect, Either } from "effect";

import type { BaseCausedCommand, BaseCommand } from "./Base.command.js";
import type { User } from "@argazi/domain";

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
		Effect.gen(function* (_) {
			const prismaService = yield* _(PrismaServiceTag);

			const initiator = yield* _(
				prismaService.queryDecode(
					Schema.optionFromNullable(UserDbToDomainSchema),
					(p) => p.user.findUnique({ where: { id: command.idInitiator } })
				),
				Effect.flatMap(
					Either.fromOption(
						() => new UnknownInitiatorBaseUseCaseError({ command })
					)
				)
			);

			return yield* _(
				cb({
					initiator,
					payload: command.payload,
				})
			);
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
		Effect.gen(function* (_) {
			const prismaService = yield* _(PrismaServiceTag);

			const initiator = yield* _(
				prismaService.queryDecode(
					Schema.optionFromNullable(UserDbToDomainSchema),
					(p) => p.user.findUnique({ where: { id: command.idInitiator } })
				),
				Effect.flatMap(
					Either.fromOption(
						() => new UnknownInitiatorBaseUseCaseError({ command })
					)
				)
			);

			return yield* _(
				cb(
					{
						initiator,
						payload: command.payload,
					},
					options
				)
			);
		});

export const BaseUseCaseFor =
	<SR, I, T extends BaseCommand>(commandSchema: Schema.Schema<T, I, SR>) =>
	<R, E, A>(cb: (args: T) => Effect.Effect<A, E, R>) =>
	(command: I) =>
		Effect.gen(function* (_) {
			const args = yield* _(Schema.decode(commandSchema)(command));
			return yield* _(cb(args));
		});
