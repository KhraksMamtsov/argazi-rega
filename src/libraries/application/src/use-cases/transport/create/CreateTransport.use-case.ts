import { Effect, Option, Secret } from "effect";

import { PrismaServiceTag, TransportDbToDomain } from "@argazi/database";

import { CreateTransportCommand } from "./CreateTransport.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateTransportUseCase = BaseCausedUseCaseFor(
  CreateTransportCommand
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;

    const newTransport = yield* prismaClient.queryDecode(
      TransportDbToDomain,
      (p) =>
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
    );

    return newTransport;
  })
);
