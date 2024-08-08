import { CreatePlaceUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { CreatePlaceEndpoint } from "./CreatePlace.endpoint.js";

export const CreatePlaceHandler = Handler.make(
  CreatePlaceEndpoint,
  ({ body }) =>
    Effect.gen(function* () {
      const newPlace = yield* CreatePlaceUseCase({
        idInitiator: IdAdmin,
        payload: body,
      });

      return newPlace;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
