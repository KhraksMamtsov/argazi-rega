import { DeleteUsersVisitorUseCase } from "@argazi/application";

import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { Effect } from "effect";

import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";

export const DeleteMyVisitorHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "deleteMyVisitor",
  BearerAuthGuard(({ path }, { idInitiator }) =>
    DeleteUsersVisitorUseCase({
      idInitiator,
      payload: {
        id: path.idVisitor,
        idUser: idInitiator,
      },
    }).pipe(Effect.orDie)
  )
);
