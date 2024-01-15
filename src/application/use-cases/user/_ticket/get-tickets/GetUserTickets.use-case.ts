import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetUserTicketsCommandSchema } from "./GetUserTickets.command.js";

import { ToDomainSchema } from "../../../../../infrastructure/database/entity/Ticket.db.js";
import { PrismaServiceTag } from "../../../../../infrastructure/database/Prisma.service.js";
import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

const schema = Schema.array(ToDomainSchema);

export const GetUserTicketsUseCase = BaseCausedUseCaseFor(
	GetUserTicketsCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		if (!initiator.isAdmin && initiator.id !== payload.idUser) {
			yield* _(
				new GetEntityAuthorizationError({
					entity: ["User", "Ticket"],
					idInitiator: initiator.id,
					payload,
				})
			);
		}

		const prismaClient = yield* _(PrismaServiceTag);

		return yield* _(
			prismaClient.queryDecode(schema, (p) =>
				p.ticket.findMany({
					where: { idUser: payload.idUser },
				})
			)
		);
	})
);
