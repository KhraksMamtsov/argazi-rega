import { Effect, Option } from "effect";

import { PrismaServiceTag, TicketDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { CreateTicketCommand } from "./CreateTicket.command.js";

import { CreateEntityAuthorizationError } from "../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateTicketUseCase = BaseCausedUseCaseFor(CreateTicketCommand)(
  ({ payload, initiator }) =>
    Effect.gen(function* () {
      const prismaClient = yield* PrismaServiceTag;
      const notificationService = yield* NotificationServiceTag;

      if (!initiator.isAdmin && initiator.id !== payload.idUser) {
        yield* new CreateEntityAuthorizationError({
          entity: "Ticket",
          idInitiator: initiator.id,
          payload: {
            ...payload,
            dateRegistered: payload.dateRegistered.toISOString(),
            idTransport: Option.getOrNull(payload.idTransport),
          },
        });
      }

      const newSubscription = yield* prismaClient.queryDecode(
        TicketDbToDomain,
        (p) =>
          p.ticket.create({
            data: {
              ...payload,
              idTransport: Option.getOrNull(payload.idTransport),
              idUserCreator: initiator.id,
              idUserUpdater: initiator.id,
            },
          })
      );

      Effect.runFork(
        notificationService.queue(
          notification.ticket("created")({
            idEntity: newSubscription.id,
            idInitiator: initiator.id,
          })
        )
      );

      return newSubscription;
    })
);
