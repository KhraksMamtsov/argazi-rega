import { GetUserSubscriptionsUseCase } from "@argazi/application";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const GetUserSubscriptionsHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "getUserSubscriptions",
  ({ path }) =>
    Effect.gen(function* () {
      const content = yield* GetUserSubscriptionsUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          idUser: path.idUser,
        },
      });

      return content;
    }).pipe(Effect.orDie)
);
