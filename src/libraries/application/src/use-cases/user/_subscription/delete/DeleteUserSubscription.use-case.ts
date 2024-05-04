import { Effect } from "effect";

import { PrismaServiceTag, SubscriptionDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { DeleteUserSubscriptionCommand } from "./DeleteUserSubscription.command.js";

import { DeleteEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const DeleteUserSubscriptionUseCase = BaseCausedUseCaseFor(
  DeleteUserSubscriptionCommand
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new DeleteEntityAuthorizationError({
        entity: "Subscription",
        idEntity: payload.idSubscription,
        idInitiator: initiator.id,
        payload,
      });
    }

    const prismaClient = yield* PrismaServiceTag;

    const deletedSubscription = yield* prismaClient.queryDecode(
      SubscriptionDbToDomain,
      (p) =>
        p.subscription.update({
          data: {
            dateDeleted: new Date(),
            idUserDeleter: initiator.id,
          },
          where: {
            id: payload.idSubscription,
          },
        })
    );

    const notificationService = yield* NotificationServiceTag;

    Effect.runFork(
      notificationService.queue(
        notification.subscription("deleted")({
          idEntity: deletedSubscription.id,
          idInitiator: initiator.id,
        })
      )
    );

    return deletedSubscription;
  })
);
