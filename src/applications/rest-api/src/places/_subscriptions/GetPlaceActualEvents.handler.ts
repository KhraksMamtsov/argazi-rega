import { GetPlaceActualEventsUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { GetPlaceActualEventsEndpoint } from "./GetPlaceActualEvents.endpoint.js";

export const GetPlaceActualEventsHandler = Handler.make(
  GetPlaceActualEventsEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const placeActualEvents = yield* GetPlaceActualEventsUseCase(
        {
          idInitiator: IdAdmin,
          payload: { idPlace: path.idPlace },
        },
        { includeDeleted: false }
      );

      return placeActualEvents;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
