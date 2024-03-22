import { Effect, Option, Secret } from "effect";

import { GeoPointDbToDomainSchema, PrismaServiceTag } from "@argazi/database";
import { notification, NotificationServiceTag } from "@argazi/domain";

import { CreateGeoPointCommandSchema } from "./CreateGeoPoint.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateGeoPointUseCase = BaseCausedUseCaseFor(
  CreateGeoPointCommandSchema
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* _(PrismaServiceTag);
    const notificationService = yield* _(NotificationServiceTag);

    const newGeoPoint = yield* _(
      prismaClient.queryDecode(GeoPointDbToDomainSchema, (p) =>
        p.geoPoint.create({
          data: {
            ...payload,
            idUserCreator: initiator.id,
            idUserUpdater: initiator.id,
            name: payload.name.pipe(Option.map(Secret.value), Option.getOrNull),
          },
        })
      )
    );

    Effect.runFork(
      notificationService.queue(
        notification.geoPoint("created")({
          idEntity: newGeoPoint.id,
          idInitiator: initiator.id,
        })
      )
    );

    return newGeoPoint;
  })
);
