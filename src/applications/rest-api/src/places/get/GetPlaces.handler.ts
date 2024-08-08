import { GetPlacesUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { GetPlacesEndpoint } from "./GetPlaces.endpoint.js";

export const GetPlacesHandler = Handler.make(GetPlacesEndpoint, () =>
  Effect.gen(function* () {
    const places = yield* GetPlacesUseCase({
      idInitiator: IdAdmin,
      payload: {},
    });

    return places;
  }).pipe(
    Effect.tapBoth({
      onFailure: Effect.logError,
      onSuccess: Effect.logInfo,
    })
  )
);
