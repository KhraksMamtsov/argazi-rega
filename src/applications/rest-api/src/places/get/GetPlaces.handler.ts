import { GetPlacesUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetPlacesHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Place",
  "getPlaces",
  ({}) =>
    Effect.gen(function* () {
      const places = yield* GetPlacesUseCase({
        idInitiator: IdAdmin,
        payload: {},
      });

      return places;
    }).pipe(Effect.orDie)
);
