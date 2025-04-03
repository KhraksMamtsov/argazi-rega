import { GetPlaceSubscriptionsUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetPlaceSubscriptionsHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Place",
  "getPlaceSubscriptions",
  ({ path }) =>
    Effect.gen(function* () {
      const placeSubscriptions = yield* GetPlaceSubscriptionsUseCase({
        idInitiator: IdAdmin,
        payload: { idPlace: path.idPlace },
      });

      return placeSubscriptions;
    }).pipe(Effect.orDie)
);
