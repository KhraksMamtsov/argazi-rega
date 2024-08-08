import { GetUserTicketByIdUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler, HttpError } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { GetMyTicketByIdEndpoint } from "./GetMyTicketById.endpoint.js";

export const GetMyTicketByIdHandler = Handler.make(
  GetMyTicketByIdEndpoint,
  BearerAuthGuard((input, { idInitiator }) =>
    GetUserTicketByIdUseCase({
      idInitiator,
      payload: {
        idTicket: input.path.idTicket,
        idUser: idInitiator,
      },
    }).pipe(
      Effect.flatten,
      Effect.tapError(Effect.logError),
      Effect.mapError(() => HttpError.notFound("NotFound2"))
    )
  )
);
