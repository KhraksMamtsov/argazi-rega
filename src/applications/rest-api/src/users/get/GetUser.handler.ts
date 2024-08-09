import { GetUserUseCase } from "@argazi/application";
import { GetUserEndpoint } from "@argazi/rest-api-spec";
import { Effect } from "effect";
import { Handler, HttpError } from "effect-http";

export const GetUserHandler = Handler.make(GetUserEndpoint, ({ path }) =>
  Effect.gen(function* () {
    const newUser = yield* GetUserUseCase({
      payload: { id: path.idUser, type: "id" },
    }).pipe(
      Effect.flatten,
      Effect.mapError(() => HttpError.notFound("NotFound1"))
    );

    return newUser;
  }).pipe(
    Effect.tapBoth({
      onFailure: Effect.logError,
      onSuccess: Effect.logInfo,
    })
  )
);
