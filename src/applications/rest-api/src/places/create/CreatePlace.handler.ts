import { CreatePlaceUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const CreatePlaceHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Place",
  "createPlace",
  ({ payload }) =>
    Effect.gen(function* () {
      const newPlace = yield* CreatePlaceUseCase({
        idInitiator: IdAdmin,
        payload,
      });

      return newPlace;
    }).pipe(Effect.orDie)
);
