import { BookTicketUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { BookTicketEndpoint } from "./BookTicket.endpoint.js";

export const BookTicketHandler = Handler.make(
  BookTicketEndpoint,
  ({ path, body }) =>
    Effect.gen(function* () {
      const result = yield* BookTicketUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          idEvent: body.idEvent,
          idUser: path.idUser,
        },
      });

      return result;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
