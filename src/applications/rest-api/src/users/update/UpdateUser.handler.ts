import { UpdateUserUseCase } from "@argazi/application";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { IdAdmin } from "../../authentication/constants.js";
import { RestApiSpec } from "@argazi/rest-api-spec";

export const UpdateUserHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "updateUser",
  ({ payload, path }) =>
    Effect.gen(function* () {
      const newUser = yield* UpdateUserUseCase({
        idInitiator: IdAdmin,
        payload: { id: path.id, ...payload },
      });

      return newUser;
    }).pipe(Effect.orDie)
);
