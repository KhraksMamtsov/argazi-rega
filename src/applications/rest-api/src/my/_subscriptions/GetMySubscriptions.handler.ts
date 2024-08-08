import { GetUserSubscriptionsUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { GetMySubscriptionsEndpoint } from "./GetMySubscriptions.endpoint.js";

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
