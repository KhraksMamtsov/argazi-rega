import { BookTicketUseCase } from "@argazi/application";
import { Effect } from "effect";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const BookTicketHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "bookTicket",
  ({ path, payload }) =>
    Effect.gen(function* () {
      const result = yield* BookTicketUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          idEvent: payload.idEvent,
          idUser: path.idUser,
        },
      });

      return result;
    }).pipe(Effect.orDie)
);
