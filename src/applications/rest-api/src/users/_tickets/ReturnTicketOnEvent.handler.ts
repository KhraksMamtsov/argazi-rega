import { ReturnTicketUseCase } from "@argazi/application";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";

import { RestApiSpec } from "@argazi/rest-api-spec";

export const ReturnTicketHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "returnTicket",
  ({ path }) =>
    Effect.gen(function* () {
      const content = yield* ReturnTicketUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          id: path.idTicket,
          idUser: path.idUser,
        },
      });

      return content;
    }).pipe(Effect.orDie)
);
