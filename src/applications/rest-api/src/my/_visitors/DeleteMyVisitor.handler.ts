import { DeleteUsersVisitorUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { DeleteMyVisitorEndpoint } from "@argazi/rest-api-spec";

export const DeleteMyVisitorHandler = Handler.make(
  DeleteMyVisitorEndpoint,
  BearerAuthGuard(({ path }, { idInitiator }) =>
    DeleteUsersVisitorUseCase({
      idInitiator,
      payload: {
        id: path.idVisitor,
        idUser: idInitiator,
      },
    })
  )
);
