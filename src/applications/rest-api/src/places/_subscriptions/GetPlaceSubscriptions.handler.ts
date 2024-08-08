import { GetPlaceSubscriptionsUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { GetPlaceSubscriptionsEndpoint } from "./GetPlaceSubscriptions.endpoint.js";

export const GetPlaceSubscriptionsHandler = Handler.make(
  GetPlaceSubscriptionsEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const placeSubscriptions = yield* GetPlaceSubscriptionsUseCase({
        idInitiator: IdAdmin,
        payload: { idPlace: path.idPlace },
      });

      return placeSubscriptions;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
