import { GetPlaceGeoPointUseCase } from "@argazi/application";
import { Effect, pipe } from "effect";
import { IdAdmin } from "../../authentication/constants.js";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetPlaceGeoPointHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Place",
  "getPlaceGeoPoint",
  ({ path }) =>
    Effect.gen(function* () {
      const geoPoint = yield* pipe(
        GetPlaceGeoPointUseCase({
          idInitiator: IdAdmin,
          payload: { idPlace: path.idPlace },
        }),
        Effect.flatten
      );

      return geoPoint;
    }).pipe(Effect.orDie)
);
