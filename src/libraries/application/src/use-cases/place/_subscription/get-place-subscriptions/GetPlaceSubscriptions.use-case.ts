import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PrismaServiceTag, SubscriptionDbToDomain } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { GetPlaceSubscriptionsCommand } from "./GetPlaceSubscriptions.command.js";

import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceSubscriptionsUseCase = BaseCausedUseCaseFor(
  GetPlaceSubscriptionsCommand
)(({ payload }) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.Array(SubscriptionDbToDomain),
      (p) =>
        p.subscription.findMany({
          where: { idPlace: payload.idPlace },
        })
    );
  })
);
