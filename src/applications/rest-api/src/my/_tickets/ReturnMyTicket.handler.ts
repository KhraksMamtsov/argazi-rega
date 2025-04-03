import { ReturnTicketUseCase } from "@argazi/application";

import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";

export const ReturnMyTicketHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "returnMyTicket",
  BearerAuthGuard((input, { idInitiator }) =>
    ReturnTicketUseCase({
      idInitiator,
      payload: {
        id: input.path.idTicket,
        idUser: idInitiator,
      },
    }).pipe(Effect.orDie)
  )
);
