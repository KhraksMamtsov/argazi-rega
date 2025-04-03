import { GetUserTicketByIdUseCase } from "@argazi/application";
import { Effect, pipe } from "effect";

import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";

export const GetUserTicketByIdHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "User",
  "getUserTicketById",
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
        Effect.flatten
      );

      return ticket;
    }).pipe(Effect.orDie)
);
