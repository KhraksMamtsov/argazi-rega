import { DeleteUserSubscriptionUseCase } from "@argazi/application";
import { DeleteUserSubscriptionEndpoint } from "@argazi/rest-api-spec";
import { Effect } from "effect";
import { Handler } from "effect-http";

export const DeleteUserSubscriptionHandler = Handler.make(
  DeleteUserSubscriptionEndpoint,
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
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
