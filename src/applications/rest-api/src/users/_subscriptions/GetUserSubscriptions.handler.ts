import { GetUserSubscriptionsUseCase } from "@argazi/application";
import { GetUserSubscriptionsEndpoint } from "@argazi/rest-api-spec";
import { Effect } from "effect";
import { Handler } from "effect-http";

export const GetUserSubscriptionsHandler = Handler.make(
  GetUserSubscriptionsEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const content = yield* GetUserSubscriptionsUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          idUser: path.idUser,
        },
      });

      return content;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
