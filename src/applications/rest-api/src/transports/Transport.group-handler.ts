import { Effect } from "effect";
import { CreateTransportUseCase } from "@argazi/application";
import { IdAdmin } from "../authentication/constants.js";
import {
  RestApiSpec,
  HttpApiUnexpectedServerError,
} from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";

export const TransportGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "Transport",
  (handlers) =>
    handlers.handle("createTransport", ({ payload }) =>
      Effect.gen(function* () {
        const newTransport = yield* CreateTransportUseCase({
          idInitiator: IdAdmin,
          payload,
        });

        return newTransport;
      }).pipe(Effect.mapError(() => new HttpApiUnexpectedServerError()))
    )
);
