import { GetUserTicketsUseCase } from "@argazi/application";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";

export const GetMyTicketsHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "getMyTickets",
  BearerAuthGuard((_, { idInitiator }) =>
    GetUserTicketsUseCase(
      {
        idInitiator,
        payload: { idUser: idInitiator },
      },
      { includeDeleted: false }
    ).pipe(Effect.orDie)
  )
);
