import { DeleteUserSubscriptionUseCase } from "@argazi/application";
import { Effect } from "effect";

import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const DeleteUserSubscriptionHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "deleteUserSubscription",
  ({ path }) =>
    Effect.gen(function* () {
      const subscription = yield* DeleteUserSubscriptionUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          idSubscription: path.idSubscription,
          idUser: path.idUser,
        },
      });

      return subscription;
    }).pipe(Effect.orDie)
);
