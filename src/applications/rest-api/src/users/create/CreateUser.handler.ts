import { CreateUserUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { CreateUserEndpoint } from "./CreateUser.endpoint.js";

export const CreateUserHandler = Handler.make(CreateUserEndpoint, ({ body }) =>
  Effect.gen(function* () {
    const newUser = yield* CreateUserUseCase({
      idInitiator: IdAdmin,
      payload: body,
    });

    return newUser;
  }).pipe(
    Effect.tapBoth({
      onFailure: Effect.logError,
      onSuccess: Effect.logInfo,
    })
  )
);
