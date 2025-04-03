import { CreateEventUseCase } from "@argazi/application";
import { Effect } from "effect";
import { IdAdmin } from "../../authentication/constants.js";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const CreateEventHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Event",
  "createEvent",
  ({ payload }) =>
    Effect.gen(function* () {
      const newEvent = yield* CreateEventUseCase({
        idInitiator: IdAdmin,
        payload,
      });

      return newEvent;
    }).pipe(Effect.orDie)
);
