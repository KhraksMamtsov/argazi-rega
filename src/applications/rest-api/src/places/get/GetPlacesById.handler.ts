import { GetPlaceByIdUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler, HttpError } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { GetPlaceByIdEndpoint } from "@argazi/rest-api-spec";

export const GetPlaceByIdHandler = Handler.make(
  GetPlaceByIdEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const newPlace = yield* GetPlaceByIdUseCase({
        idInitiator: IdAdmin,
        payload: { id: path.idPlace },
      }).pipe(
        Effect.flatten,
        Effect.mapError(() => HttpError.notFound("NotFound4"))
      );

      return newPlace;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
