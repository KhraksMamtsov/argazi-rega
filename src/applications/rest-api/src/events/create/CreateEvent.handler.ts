import { CreateEventUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { CreateEventEndpoint } from "./CreateEvent.endpoint.js";

export const CreateEventHandler = Handler.make(
  CreateEventEndpoint,
  ({ body }) =>
    Effect.gen(function* () {
      const newEvent = yield* CreateEventUseCase({
        idInitiator: IdAdmin,
        payload: body,
      });

      return newEvent;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
