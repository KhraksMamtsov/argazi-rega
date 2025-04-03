import { GetSubscriptionByIdUseCase } from "@argazi/application";
import { Effect, pipe } from "effect";
import { IdAdmin } from "../../authentication/constants.js";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetSubscriptionByIdHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Subscriptions",
  "getSubscription",
  ({ path }) =>
    Effect.gen(function* () {
      const subscriptionOption = yield* pipe(
        GetSubscriptionByIdUseCase({
          idInitiator: IdAdmin,
          payload: { idSubscription: path.idSubscription },
        }),
        Effect.tapError((x) => Effect.logError(x))
      );

      return yield* subscriptionOption;
    }).pipe(Effect.orDie)
);
