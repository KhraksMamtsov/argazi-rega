import { GetManyUsersUseCase } from "@argazi/application";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";

export const GetManyUsersHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "getManyUsers",
  ({ payload }) =>
    Effect.gen(function* () {
      if (payload.idsUser === undefined) {
        return [];
      }

      const newUserOption = yield* GetManyUsersUseCase({
        payload: { idsUser: payload.idsUser, type: "id" },
      });

      return newUserOption;
    }).pipe(Effect.orDie)
);
