import { Effect } from "effect";

import { PrismaServiceTag, TicketDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { BookTicketCommand } from "./BookTicket.command.js";

import { CreateEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const BookTicketUseCase = BaseCausedUseCaseFor(BookTicketCommand)(
  ({ payload, initiator }) =>
    Effect.gen(function* () {
      const prismaClient = yield* PrismaServiceTag;
      const notificationService = yield* NotificationServiceTag;

      if (!initiator.isAdmin && initiator.id !== payload.idUser) {
        yield* new CreateEntityAuthorizationError({
          entity: "Ticket",
          idInitiator: initiator.id,
          payload: payload,
        });
      }

      const newTicket = yield* prismaClient.queryDecode(TicketDbToDomain, (p) =>
        p.ticket.create({
          data: {
            ...payload,
            idUserCreator: initiator.id,
            idUserUpdater: initiator.id,
            role: "NONE",
          },
        })
      );

      Effect.runFork(
        notificationService.queue(
          notification.ticket("created")({
            idEntity: newTicket.id,
            idInitiator: initiator.id,
          })
        )
      );

      return newTicket;
    })
);
