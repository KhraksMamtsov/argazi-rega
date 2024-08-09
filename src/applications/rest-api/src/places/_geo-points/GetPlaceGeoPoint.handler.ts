import { GetPlaceGeoPointUseCase } from "@argazi/application";
import { Effect, pipe } from "effect";
import { Handler, HttpError } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { GetPlaceGeoPointEndpoint } from "@argazi/rest-api-spec";

export const GetPlaceGeoPointHandler = Handler.make(
  GetPlaceGeoPointEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const geoPoint = yield* pipe(
        GetPlaceGeoPointUseCase({
          idInitiator: IdAdmin,
          payload: { idPlace: path.idPlace },
        }),
        Effect.flatten,
        Effect.mapError(() => HttpError.notFound("NotFound4"))
      );

      return geoPoint;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
