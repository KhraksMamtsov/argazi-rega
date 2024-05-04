import { Effect, Option, Secret } from "effect";

import { GeoPointDbToDomain, PrismaServiceTag } from "@argazi/database";
import { notification, NotificationServiceTag } from "@argazi/domain";

import { CreateGeoPointCommand } from "./CreateGeoPoint.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateGeoPointUseCase = BaseCausedUseCaseFor(
  CreateGeoPointCommand
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;
    const notificationService = yield* NotificationServiceTag;

    const newGeoPoint = yield* prismaClient.queryDecode(
      GeoPointDbToDomain,
      (p) =>
        p.geoPoint.create({
          data: {
            ...payload,
            idUserCreator: initiator.id,
            idUserUpdater: initiator.id,
            name: payload.name.pipe(Option.map(Secret.value), Option.getOrNull),
          },
        })
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
