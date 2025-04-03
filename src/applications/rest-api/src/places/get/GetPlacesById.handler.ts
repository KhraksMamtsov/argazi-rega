import { GetPlaceByIdUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetPlaceByIdHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Place",
  "getPlaceById",
  ({ path }) =>
    Effect.gen(function* () {
      const newPlace = yield* GetPlaceByIdUseCase({
        idInitiator: IdAdmin,
        payload: { id: path.idPlace },
      }).pipe(Effect.flatten);

      return newPlace;
    }).pipe(Effect.orDie)
);
