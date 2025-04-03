import { GetUserTicketByIdUseCase } from "@argazi/application";
import { Effect } from "effect";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";

export const GetMyTicketByIdHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "getMyTicketById",
  BearerAuthGuard((input, { idInitiator }) =>
    GetUserTicketByIdUseCase({
      idInitiator,
      payload: {
        idTicket: input.path.idTicket,
        idUser: idInitiator,
      },
    }).pipe(Effect.flatten, Effect.orDie)
  )
);
