import { GetUserTicketByIdUseCase } from "@argazi/application";
import { Effect, pipe } from "effect";
import { Handler, HttpError } from "effect-http";
import { GetUserTicketByIdEndpoint } from "./GetUserTicketById.endpoint.js";

export const GetUserTicketByIdHandler = Handler.make(
  GetUserTicketByIdEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const ticket = yield* pipe(
        GetUserTicketByIdUseCase({
          idInitiator: path.idUser, // Todo: take from security
          payload: {
            idTicket: path.idTicket,
            idUser: path.idUser,
          },
        }),
        Effect.flatten,
        Effect.tapError(Effect.logError),
        Effect.mapError(() => HttpError.notFound("NotFound2"))
      );

      return ticket;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
