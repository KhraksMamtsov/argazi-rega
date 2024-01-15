import { Effect, Option, Secret } from "effect";

import { CreateTransportCommandSchema } from "./CreateTransport.command.js";

import { ToDomainSchema } from "../../../../infrastructure/database/entity/Transport.db.js";
import { PrismaServiceTag } from "../../../../infrastructure/database/Prisma.service.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateTransportUseCase = BaseCausedUseCaseFor(
	CreateTransportCommandSchema
)(({ payload, initiator }) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		const newTransport = yield* _(
			prismaClient.queryDecode(ToDomainSchema, (p) =>
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
