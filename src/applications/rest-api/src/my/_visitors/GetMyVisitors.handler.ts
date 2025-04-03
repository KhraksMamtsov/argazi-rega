import { GetUsersVisitorsUseCase } from "@argazi/application";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { Effect } from "effect";

export const GetMyVisitorsHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "getMyVisitors",
  BearerAuthGuard((_, { idInitiator }) =>
    GetUsersVisitorsUseCase(
      {
        idInitiator,
        payload: {
          idUser: idInitiator,
        },
      },
      { includeDeleted: false }
    ).pipe(Effect.orDie)
  )
);
