import { Schema } from "@effect/schema";
import { Effect } from "effect";

import {
  PrismaServiceTag,
  SubscriptionDbToDomainSchema,
} from "@argazi/database";

import { GetUserSubscriptionsCommandSchema } from "./GetUserSubscriptions.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetUserSubscriptionsUseCase = BaseCausedUseCaseFor(
  GetUserSubscriptionsCommandSchema
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* _(
        new GetEntityAuthorizationError({
          entity: ["User", "Subscription"],
          idInitiator: initiator.id,
          payload,
        })
      );
    }

    const prismaClient = yield* _(PrismaServiceTag);

    return yield* _(
      prismaClient.queryDecode(
        Schema.Array(SubscriptionDbToDomainSchema),
        (p) =>
          p.subscription.findMany({
            where: {
              dateDeleted: null,
              idUser: payload.idUser,
            },
          })
      )
    );
  })
);
