import { Schema } from "@effect/schema";
import { Effect } from "effect";

import {
  PrismaServiceTag,
  SubscriptionDbToDomainSchema,
} from "@argazi/database";

import { GetSubscriptionByIdCommandSchema } from "./GetSubscriptionById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetSubscriptionByIdUseCase = BaseCausedUseCaseFor(
  GetSubscriptionByIdCommandSchema
)(({ payload }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(SubscriptionDbToDomainSchema),
      (p) =>
        p.subscription.findUnique({ where: { id: payload.idSubscription } })
    );
  })
);
