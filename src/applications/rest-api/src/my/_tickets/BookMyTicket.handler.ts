import { BookTicketUseCase } from "@argazi/application";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";

import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";

export const BookMyTicketHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "bookMyTicket",
  BearerAuthGuard(({ payload }, { idInitiator }) =>
    BookTicketUseCase({
      idInitiator,
      payload: {
        idEvent: payload.idEvent,
        idUser: idInitiator,
      },
    }).pipe(Effect.orDie)
  )
);
