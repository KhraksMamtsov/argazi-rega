import { Effect, Option, Secret } from "effect";

import { PrismaServiceTag, TransportDbToDomainSchema } from "@argazi/database";

import { CreateTransportCommandSchema } from "./CreateTransport.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateTransportUseCase = BaseCausedUseCaseFor(
	CreateTransportCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		const newTransport = yield* _(
			prismaClient.queryDecode(TransportDbToDomainSchema, (p) =>
				p.transport.create({
					data: {
						...payload,
						idUserCreator: initiator.id,
						idUserUpdater: initiator.id,
						model: payload.model.pipe(
							Option.map(Secret.value),
							Option.getOrNull
						),
						number: Secret.value(payload.number),
					},
				})
			)
		);

		return newTransport;
	})
);
