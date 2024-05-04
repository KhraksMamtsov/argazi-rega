import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PrismaServiceTag, SubscriptionDbToDomain } from "@argazi/database";

import { GetSubscriptionByIdCommand } from "./GetSubscriptionById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetSubscriptionByIdUseCase = BaseCausedUseCaseFor(
  GetSubscriptionByIdCommand
)(({ payload }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(SubscriptionDbToDomain),
      (p) =>
        p.subscription.findUnique({ where: { id: payload.idSubscription } })
    );
  })
);
