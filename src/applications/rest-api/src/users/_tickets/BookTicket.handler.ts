import { BookTicketUseCase } from "@argazi/application";
import { BookTicketEndpoint } from "@argazi/rest-api-spec";
import { Effect } from "effect";
import { Handler } from "effect-http";

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
