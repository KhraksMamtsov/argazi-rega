import { CreateSubscriptionUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { CreateMySubscriptionEndpoint } from "@argazi/rest-api-spec";

export const CreateMySubscriptionHandler = Handler.make(
  CreateMySubscriptionEndpoint,
  BearerAuthGuard((input, { idInitiator }) =>
    CreateSubscriptionUseCase({
      idInitiator,
      payload: {
        idPlace: input.body.idPlace,
        idUser: idInitiator,
      },
    })
  )
);
