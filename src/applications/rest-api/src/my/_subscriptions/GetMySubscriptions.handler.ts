import { GetUserSubscriptionsUseCase } from "@argazi/application";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";

export const GetMySubscriptionsHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "getMySubscriptions",
  BearerAuthGuard((_, { idInitiator }) =>
    GetUserSubscriptionsUseCase({
      idInitiator,
      payload: {
        idUser: idInitiator,
      },
    }).pipe(Effect.orDie)
  )
);
