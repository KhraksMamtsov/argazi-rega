import { GetEventByIdUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetEventHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Event",
  "getEvent",
  ({ path }) =>
    Effect.gen(function* () {
      const newEventOption = yield* GetEventByIdUseCase({
        idInitiator: IdAdmin,
        payload: { id: path.idEvent },
      }).pipe(Effect.flatten);

      return newEventOption;
    }).pipe(Effect.orDie)
);
