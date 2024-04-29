import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PrismaServiceTag, TicketDbToDomainSchema } from "@argazi/database";

import { GetUserTicketByIdCommandSchema } from "./GetUserTicketById.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetUserTicketByIdUseCase = BaseCausedUseCaseFor(
  GetUserTicketByIdCommandSchema
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new GetEntityAuthorizationError({
        entity: ["User", "Ticket"],
        idInitiator: initiator.id,
        payload,
      });
    }

    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(TicketDbToDomainSchema),
      (p) =>
        p.ticket.findUnique({
          where: { id: payload.idTicket, idUser: payload.idUser },
        })
    );
  })
);
