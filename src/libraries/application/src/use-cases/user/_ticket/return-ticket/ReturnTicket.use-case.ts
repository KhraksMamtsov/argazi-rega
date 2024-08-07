import { Effect } from "effect";

import { PrismaServiceTag, TicketDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { ReturnTicketCommand } from "./ReturnTicket.command.js";

import { DeleteEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const ReturnTicketUseCase = BaseCausedUseCaseFor(ReturnTicketCommand)(
  ({ payload, initiator }) =>
    Effect.gen(function* () {
      const prismaClient = yield* PrismaServiceTag;
      const notificationService = yield* NotificationServiceTag;

      if (!initiator.isAdmin && initiator.id !== payload.idUser) {
        yield* new DeleteEntityAuthorizationError({
          entity: "Ticket",
          idEntity: payload.id,
          idInitiator: initiator.id,
          payload: payload,
        });
      }

      const deletedTicket = yield* prismaClient.queryDecode(
        TicketDbToDomain,
        (p) =>
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
