import { CreateUsersVisitorUseCase } from "@argazi/application";
import { Effect } from "effect";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";

import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";

export const CreateMyVisitorHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "createMyVisitor",
  BearerAuthGuard(({ payload }, { idInitiator }) =>
    CreateUsersVisitorUseCase({
      idInitiator,
      payload: {
        email: payload.email,
        idUser: idInitiator,
        name: payload.name,
        type: payload.type,
      },
    }).pipe(Effect.orDie)
  )
);
