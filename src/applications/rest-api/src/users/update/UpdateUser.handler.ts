import { UpdateUserUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { UpdateUserEndpoint } from "@argazi/rest-api-spec";

export const UpdateUserHandler = Handler.make(
  UpdateUserEndpoint,
  ({ body, path }) =>
    Effect.gen(function* () {
      const newUser = yield* UpdateUserUseCase({
        idInitiator: IdAdmin,
        payload: { id: path.id, ...body },
      });

      return newUser;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
