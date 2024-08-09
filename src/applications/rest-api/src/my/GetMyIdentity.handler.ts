import { GetUserUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler, HttpError } from "effect-http";
import { BearerAuthGuard } from "../BearerAuth.guard.js";
import { GetMyIdentityEndpoint } from "@argazi/rest-api-spec";

export const GetMyIdentityHandler = Handler.make(
  GetMyIdentityEndpoint,
  BearerAuthGuard((_, { idInitiator }) => {
    const user = GetUserUseCase({
      payload: {
        id: idInitiator,
        type: "id",
      },
    }).pipe(
      Effect.flatten,
      Effect.mapError(() => HttpError.notFound("NotFound2"))
    );

    return user;
  })
);
