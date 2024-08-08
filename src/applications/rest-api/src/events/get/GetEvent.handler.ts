import { Handler, HttpError } from "effect-http";
import { GetEventEndpoint } from "./GetEvent.endpoint.js";
import { GetEventByIdUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";

export const GetEventHandler = Handler.make(GetEventEndpoint, ({ path }) =>
  Effect.gen(function* () {
    const newEventOption = yield* GetEventByIdUseCase({
      idInitiator: IdAdmin,
      payload: { id: path.idEvent },
    }).pipe(
      Effect.flatten,
      Effect.mapError(() => HttpError.notFound("NotFound3"))
    );

    return newEventOption;
  }).pipe(
    Effect.tapBoth({
      onFailure: Effect.logError,
      onSuccess: Effect.logInfo,
    })
  )
);
