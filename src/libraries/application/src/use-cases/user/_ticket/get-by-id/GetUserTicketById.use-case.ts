import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GetUserTicketByIdCommandSchema } from "./GetUserTicketById.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";
import { PrismaServiceTag, TicketDbToDomainSchema } from "@argazi/database";

export const GetUserTicketByIdUseCase = BaseCausedUseCaseFor(
	GetUserTicketByIdCommandSchema
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
			prismaClient.queryDecode(
				Schema.optionFromNullable(TicketDbToDomainSchema),
				(p) =>
					p.ticket.findUnique({
						where: { id: payload.idTicket, idUser: payload.idUser },
					})
			)
		);
	})
);
