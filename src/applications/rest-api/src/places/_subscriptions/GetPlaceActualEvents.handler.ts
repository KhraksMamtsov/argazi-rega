import { GetPlaceActualEventsUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetPlaceActualEventsHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Place",
  "getPlaceActualEvents",
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
    }).pipe(Effect.orDie)
);
