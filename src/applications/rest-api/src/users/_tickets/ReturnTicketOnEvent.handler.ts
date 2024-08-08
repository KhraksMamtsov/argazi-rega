import { ReturnTicketUseCase } from "@argazi/application";
import { Effect } from "effect";
import { Handler } from "effect-http";
import { ReturnTicketEndpoint } from "./ReturnTicketOnEvent.endpoint.js";

export const ReturnTicketHandler = Handler.make(
  ReturnTicketEndpoint,
  ({ path }) =>
    Effect.gen(function* () {
      const content = yield* ReturnTicketUseCase({
        idInitiator: path.idUser, // Todo: take from security
        payload: {
          id: path.idTicket,
          idUser: path.idUser,
        },
      });

      return content;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
