import { GetUserUseCase } from "@argazi/application";
import { Effect } from "effect";
import { BearerAuthGuard } from "../BearerAuth.guard.js";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetMyIdentityHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "My",
  "getMyIdentity",
  BearerAuthGuard((_, { idInitiator }) =>
    Effect.gen(function* () {
      const user = yield* GetUserUseCase({
        payload: {
          id: idInitiator,
          type: "id",
        },
      }).pipe(Effect.flatten);

      return user;
    }).pipe(Effect.orDie)
  )
);
