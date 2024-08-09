import { CreateUsersVisitorUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { CreateMyVisitorEndpoint } from "@argazi/rest-api-spec";

export const CreateMyVisitorHandler = Handler.make(
  CreateMyVisitorEndpoint,
  BearerAuthGuard(({ body }, { idInitiator }) =>
    CreateUsersVisitorUseCase({
      idInitiator,
      payload: {
        email: body.email,
        idUser: idInitiator,
        name: body.name,
        type: body.type,
      },
    })
  )
);
