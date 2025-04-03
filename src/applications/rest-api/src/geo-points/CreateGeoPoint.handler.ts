import { CreateGeoPointUseCase } from "@argazi/application";
import { Effect } from "effect";
import { BearerAuthGuard } from "../BearerAuth.guard.js";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const CreateGeoPointHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "GeoPoint",
  "createGeoPoint",
  BearerAuthGuard(({ payload }, { idInitiator }) =>
    Effect.gen(function* () {
      const geoPoint = yield* CreateGeoPointUseCase({
        idInitiator,
        payload,
      });

      return geoPoint;
    }).pipe(Effect.orDie)
  )
);
