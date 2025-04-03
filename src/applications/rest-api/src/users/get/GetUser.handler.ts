import { GetUserUseCase } from "@argazi/application";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";

export const GetUserHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "getUser",
  ({ path }) =>
    Effect.gen(function* () {
      const newUser = yield* GetUserUseCase({
        payload: { id: path.idUser, type: "id" },
      }).pipe(
        Effect.flatten
        // Effect.mapError(() => undefined)
      );

      return newUser;
    }).pipe(Effect.orDie)
);
