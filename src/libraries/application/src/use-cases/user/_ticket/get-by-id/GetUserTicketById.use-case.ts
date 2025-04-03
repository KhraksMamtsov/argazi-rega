import { Schema } from "effect";
import { Effect } from "effect";

import { PrismaServiceTag, TicketDbToDomain } from "@argazi/database";

import { GetUserTicketByIdCommand } from "./GetUserTicketById.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetUserTicketByIdUseCase = BaseCausedUseCaseFor(
  GetUserTicketByIdCommand
)(({ payload, initiator }) =>
  Effect.gen(function* () {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new GetEntityAuthorizationError({
        entity: ["User", "Ticket"],
        idInitiator: initiator.id,
        payload,
      });
    }

    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(TicketDbToDomain),
      (p) =>
        p.ticket.findUnique({
          where: { id: payload.idTicket, idUser: payload.idUser },
        })
    );
  })
);
