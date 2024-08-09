import { ReturnTicketUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { ReturnMyTicketEndpoint } from "@argazi/rest-api-spec";

export const ReturnMyTicketHandler = Handler.make(
  ReturnMyTicketEndpoint,
  BearerAuthGuard((input, { idInitiator }) =>
    ReturnTicketUseCase({
      idInitiator,
      payload: {
        id: input.path.idTicket,
        idUser: idInitiator,
      },
    })
  )
);
