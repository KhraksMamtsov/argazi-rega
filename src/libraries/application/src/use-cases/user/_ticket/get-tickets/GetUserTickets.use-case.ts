import { Schema } from "effect";
import { Effect } from "effect";

import { PrismaServiceTag, TicketDbToDomain } from "@argazi/database";

import { GetUserTicketsCommand } from "./GetUserTickets.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseGetCausedUseCaseFor } from "../../../common/Base.use-case.js";

const schema = Schema.Array(TicketDbToDomain);

export const GetUserTicketsUseCase = BaseGetCausedUseCaseFor(
  GetUserTicketsCommand
)(({ payload, initiator }, { includeDeleted }) =>
  Effect.gen(function* () {
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
