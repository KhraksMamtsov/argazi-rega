import { CreateUsersVisitorUseCase } from "@argazi/application";
import { Effect } from "effect";
import { HttpApiBuilder } from "@effect/platform";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";

export const CreateUsersVisitorHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "createUsersVisitor",
  BearerAuthGuard(({ payload, path }, { idInitiator }) =>
    Effect.gen(function* () {
      const newVisitor = yield* CreateUsersVisitorUseCase({
        idInitiator,
        payload: {
          ...payload,
          idUser: path.idUser,
        },
      });

      return newVisitor;
    }).pipe(Effect.orDie)
  )
);
