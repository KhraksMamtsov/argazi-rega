import { CreateSubscriptionUseCase } from "@argazi/application";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";

import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";

export const CreateMySubscriptionHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "createMySubscription",
  BearerAuthGuard((input, { idInitiator }) =>
    CreateSubscriptionUseCase({
      idInitiator,
      payload: {
        idPlace: input.payload.idPlace,
        idUser: idInitiator,
      },
    }).pipe(Effect.orDie)
  )
);
