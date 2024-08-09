import { DeleteUserSubscriptionUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { DeleteMySubscriptionEndpoint } from "@argazi/rest-api-spec";

export const DeleteMySubscriptionHandler = Handler.make(
  DeleteMySubscriptionEndpoint,
  BearerAuthGuard(({ path }, { idInitiator }) =>
    DeleteUserSubscriptionUseCase({
      idInitiator,
      payload: {
        idSubscription: path.idSubscription,
        idUser: idInitiator,
      },
    })
  )
);
