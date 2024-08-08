import { DeleteUserSubscriptionUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { DeleteUserSubscriptionEndpoint } from "./DeleteUserSubscription.endpoint.js";

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
