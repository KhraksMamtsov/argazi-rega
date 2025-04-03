import { DeleteUserSubscriptionUseCase } from "@argazi/application";

import { BearerAuthGuard } from "../../BearerAuth.guard.js";

import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";

export const DeleteMySubscriptionHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "deleteMySubscription",
  BearerAuthGuard(({ path }, { idInitiator }) =>
    DeleteUserSubscriptionUseCase({
      idInitiator,
      payload: {
        idSubscription: path.idSubscription,
        idUser: idInitiator,
      },
    }).pipe(Effect.orDie)
  )
);
