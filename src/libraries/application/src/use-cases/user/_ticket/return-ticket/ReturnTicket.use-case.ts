import { Effect } from "effect";

import { PrismaServiceTag, TicketDbToDomainSchema } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { ReturnTicketCommandSchema } from "./ReturnTicket.command.js";

import { DeleteEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const ReturnTicketUseCase = BaseCausedUseCaseFor(
  ReturnTicketCommandSchema
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* _(PrismaServiceTag);
    const notificationService = yield* _(NotificationServiceTag);

    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* _(
        new DeleteEntityAuthorizationError({
          entity: "Ticket",
          idEntity: payload.id,
          idInitiator: initiator.id,
          payload: payload,
        })
      );
    }

    const deletedTicket = yield* _(
      prismaClient.queryDecode(TicketDbToDomainSchema, (p) =>
        p.ticket.update({
          data: {
            dateDeleted: new Date(),
            idUserDeleter: initiator.id,
          },
          where: {
            id: payload.id,
            idUser: payload.idUser,
          },
        })
      )
    );

    Effect.runFork(
      notificationService.queue(
        notification.ticket("deleted")({
          idEntity: deletedTicket.id,
          idInitiator: initiator.id,
        })
      )
    );

    return deletedTicket;
  })
);
