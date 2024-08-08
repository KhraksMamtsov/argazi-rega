import { GetSubscriptionByIdUseCase } from "@argazi/application";
import { Effect, pipe, Option } from "effect";
import { Handler, HttpError } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { GetSubscriptionByIdEndpoint } from "./GetSubscriptionById.endpoint.js";

export const GetSubscriptionByIdHandler = Handler.make(
  GetSubscriptionByIdEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const subscriptionOption = yield* pipe(
        GetSubscriptionByIdUseCase({
          idInitiator: IdAdmin,
          payload: { idSubscription: path.idSubscription },
        }),
        Effect.tapError((x) => Effect.logError(x))
      );

      return yield* subscriptionOption.pipe(
        Option.match({
          onNone: () => HttpError.notFound("Not Found"),
          onSome: (subscription) => Effect.succeed(subscription),
        })
      );
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
