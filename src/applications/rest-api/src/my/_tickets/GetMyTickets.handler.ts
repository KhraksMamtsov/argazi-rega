import { GetUserTicketsUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { GetMyTicketsEndpoint } from "@argazi/rest-api-spec";

export const GetMyTicketsHandler = Handler.make(
  GetMyTicketsEndpoint,
  BearerAuthGuard((_, { idInitiator }) =>
    GetUserTicketsUseCase(
      {
        idInitiator,
        payload: { idUser: idInitiator },
      },
      { includeDeleted: false }
    )
  )
);
