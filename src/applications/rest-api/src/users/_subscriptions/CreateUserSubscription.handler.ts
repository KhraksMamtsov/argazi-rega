import { CreateSubscriptionUseCase } from "@argazi/application";
import {
  RestApiSpec,
  HttpApiUnexpectedServerError,
} from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";

export const CreateUserSubscriptionHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "createUserSubscription",
  ({ path, payload }) =>
    Effect.gen(function* () {
      const content = yield* CreateSubscriptionUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          idPlace: payload.idPlace,
          idUser: path.idUser,
        },
      });

      return content;
    }).pipe(Effect.mapError(() => new HttpApiUnexpectedServerError()))
);
