import { Effect } from "effect";

import { EventDbToDomain, PrismaServiceTag } from "@argazi/database";
import { notification } from "@argazi/domain";
import { NotificationServiceTag } from "@argazi/domain";

import { CreateEventCommand } from "./CreateEvent.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateEventUseCase = BaseCausedUseCaseFor(CreateEventCommand)(
  ({ payload, initiator }) =>
    Effect.gen(function* (_) {
      const prismaClient = yield* PrismaServiceTag;
      const notificationService = yield* NotificationServiceTag;

      const newEvent = yield* prismaClient.queryDecode(EventDbToDomain, (p) =>
        p.event.create({
          data: {
            description: payload.description,
            dateAnnouncement: payload.dateAnnouncement,
            dateDeadline: payload.dateDeadline,
            dateFinish: payload.dateFinish,
            dateStart: payload.dateStart,
            idPlace: payload.idPlace,
            idUserCreator: initiator.id,
            idUserUpdater: initiator.id,
            name: payload.name,
            priceDay: payload.priceDay,
            priceEvent: payload.priceEvent,
          },
        })
      );

      Effect.runFork(
        notificationService.queue(
          notification.event("created")({
            idEntity: newEvent.id,
            idInitiator: initiator.id,
          })
        )
      );

      return newEvent;
    })
);
