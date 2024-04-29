import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PrismaServiceTag, TicketDbToDomainSchema } from "@argazi/database";

import { GetUserTicketsCommandSchema } from "./GetUserTickets.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseGetCausedUseCaseFor } from "../../../common/Base.use-case.js";

const schema = Schema.Array(TicketDbToDomainSchema);

export const GetUserTicketsUseCase = BaseGetCausedUseCaseFor(
  GetUserTicketsCommandSchema
)(({ payload, initiator }, { includeDeleted }) =>
  Effect.gen(function* (_) {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new GetEntityAuthorizationError({
        entity: ["User", "Ticket"],
        idInitiator: initiator.id,
        payload,
      });
    }

    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(schema, (p) =>
      p.ticket.findMany({
        where: {
          idUser: payload.idUser,
          ...(includeDeleted ? {} : { dateDeleted: null, idUserDeleter: null }),
        },
      })
    );
  })
);
