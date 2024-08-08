import { BookTicketUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { BookMyTicketEndpoint } from "./BookMyTicket.endpoint.js";

export const BookMyTicketHandler = Handler.make(
  BookMyTicketEndpoint,
  BearerAuthGuard((input, { idInitiator }) =>
    BookTicketUseCase({
      idInitiator,
      payload: {
        idEvent: input.body.idEvent,
        idUser: idInitiator,
      },
    })
  )
);
