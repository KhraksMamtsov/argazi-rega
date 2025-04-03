import { CreateUserUseCase } from "@argazi/application";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { IdAdmin } from "../../authentication/constants.js";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const CreateUserHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "createUser",
  ({ payload }) =>
    Effect.gen(function* () {
      const newUser = yield* CreateUserUseCase({
        idInitiator: IdAdmin,
        payload,
      });

      return newUser;
    }).pipe(Effect.orDie)
);
