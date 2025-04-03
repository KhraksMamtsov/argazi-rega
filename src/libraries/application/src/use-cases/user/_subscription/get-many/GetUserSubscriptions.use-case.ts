import { Schema } from "effect";
import { Effect } from "effect";

import { PrismaServiceTag, SubscriptionDbToDomain } from "@argazi/database";

import { GetUserSubscriptionsCommand } from "./GetUserSubscriptions.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetUserSubscriptionsUseCase = BaseCausedUseCaseFor(
  GetUserSubscriptionsCommand
)(({ payload, initiator }) =>
  Effect.gen(function* () {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new GetEntityAuthorizationError({
        entity: ["User", "Subscription"],
        idInitiator: initiator.id,
        payload,
      });
    }

    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.Array(SubscriptionDbToDomain),
      (p) =>
        p.subscription.findMany({
          where: {
            dateDeleted: null,
            idUser: payload.idUser,
          },
        })
    );
  })
);
