import { Effect } from "effect";

import { PrismaServiceTag, SubscriptionDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { CreateSubscriptionCommand } from "./CreateSubscription.command.js";

import { CreateEntityAuthorizationError } from "../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateSubscriptionUseCase = BaseCausedUseCaseFor(
  CreateSubscriptionCommand
)(({ payload, initiator }) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;
    const notificationService = yield* NotificationServiceTag;

    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new CreateEntityAuthorizationError({
        entity: "Subscription",
        idInitiator: initiator.id,
        payload,
      });
    }

    const newSubscription = yield* prismaClient.queryDecode(
      SubscriptionDbToDomain,
      (p) =>
        p.subscription.create({
          data: {
            idPlace: payload.idPlace,
            idUser: payload.idUser,
            idUserCreator: initiator.id,
            idUserUpdater: initiator.id,
          },
        })
    );

    Effect.runFork(
      notificationService.queue(
        notification.subscription("created")({
          idEntity: newSubscription.id,
          idInitiator: initiator.id,
        })
      )
    );

    return newSubscription;
  })
);
