import { Schema } from "@effect/schema";
import { absurd, Effect } from "effect";

import { type GetUserCommand } from "./GetUser.command.js";

import { ToDomainSchema } from "../../../../infrastructure/database/entity/User.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";

export const GetUserUseCase = ({ payload }: GetUserCommand) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		const where =
			payload.type === "id"
				? { id: payload.id }
				: payload.type === "idDwbn"
					? { idDwbn: payload.idDwbn }
					: absurd<never>(payload);

		return yield* _(
			prismaClient.queryDecode(Schema.optionFromNullable(ToDomainSchema), (p) =>
				p.user.findUnique({ where })
			)
		);
	});
