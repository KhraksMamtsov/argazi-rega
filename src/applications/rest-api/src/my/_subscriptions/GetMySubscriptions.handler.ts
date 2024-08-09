import { GetUserSubscriptionsUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { GetMySubscriptionsEndpoint } from "@argazi/rest-api-spec";

export const GetMySubscriptionsHandler = Handler.make(
  GetMySubscriptionsEndpoint,
  BearerAuthGuard((_, { idInitiator }) =>
    GetUserSubscriptionsUseCase({
      idInitiator,
      payload: {
        idUser: idInitiator,
      },
    })
  )
);
