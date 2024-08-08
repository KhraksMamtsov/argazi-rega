import { CreateGeoPointUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../BearerAuth.guard.js";
import { CreateGeoPointEndpoint } from "./CreateGeoPoint.endpoint.js";

export const CreateGeoPointHandler = Handler.make(
  CreateGeoPointEndpoint,
  BearerAuthGuard(({ body }, { idInitiator }) =>
    Effect.gen(function* () {
      const geoPoint = yield* CreateGeoPointUseCase({
        idInitiator,
        payload: body,
      });

      return geoPoint;
    })
  )
);
