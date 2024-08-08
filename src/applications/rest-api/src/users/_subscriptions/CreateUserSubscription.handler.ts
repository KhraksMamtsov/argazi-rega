import { CreateSubscriptionUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { CreateUserSubscriptionEndpoint } from "./CreateUserSubscription.endpoint.js";

export const CreateUserSubscriptionHandler = Handler.make(
  CreateUserSubscriptionEndpoint,
  ({ path, body }) =>
    Effect.gen(function* () {
      const content = yield* CreateSubscriptionUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          idPlace: body.idPlace,
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
