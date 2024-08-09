import { CreateUsersVisitorUseCase } from "@argazi/application";
import { Effect } from "effect";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { Handler } from "effect-http";
import { CreateUsersVisitorEndpoint } from "@argazi/rest-api-spec";

export const CreateUsersVisitorHandler = Handler.make(
  CreateUsersVisitorEndpoint,
  BearerAuthGuard(({ body, path }, { idInitiator }) =>
    Effect.gen(function* () {
      const newVisitor = yield* CreateUsersVisitorUseCase({
        idInitiator,
        payload: {
          ...body,
          idUser: path.idUser,
        },
      });

      return newVisitor;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
  )
);
