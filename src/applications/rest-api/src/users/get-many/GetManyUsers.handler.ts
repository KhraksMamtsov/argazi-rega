import { GetManyUsersUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { GetManyUsersEndpoint } from "./GetManyUsers.endpoint.js";

export const GetManyUsersHandler = Handler.make(
  GetManyUsersEndpoint,
  ({ body }) =>
    Effect.gen(function* () {
      if (body.idsUser === undefined) {
        return [];
      }

      const newUserOption = yield* GetManyUsersUseCase({
        payload: { idsUser: body.idsUser, type: "id" },
      });

      return newUserOption;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
