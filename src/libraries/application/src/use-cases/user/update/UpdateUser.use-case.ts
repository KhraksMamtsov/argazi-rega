import { Schema } from "@effect/schema";
import { Effect } from "effect";

import {
	type UpdateUserCommand,
	UpdateUserCommandPayloadSchema,
} from "./UpdateUser.command.js";

import { UserDbToDomainSchema, PrismaServiceTag } from "@argazi/database";

const encodePayload = Schema.encode(UpdateUserCommandPayloadSchema);

export const UpdateUserUseCase = (command: UpdateUserCommand) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		const { id, ...rest } = yield* _(encodePayload(command.payload));

		// create user using domain userService produced new User? + events about its creation???
		return yield* _(
			prismaClient.update("user", UserDbToDomainSchema, {
				data: { ...rest, idUserUpdater: command.idInitiator },
				where: { id },
			})
		);
	});
