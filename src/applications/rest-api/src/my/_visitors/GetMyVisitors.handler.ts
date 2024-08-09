import { GetUsersVisitorsUseCase } from "@argazi/application";
import { Handler } from "effect-http";
import { BearerAuthGuard } from "../../BearerAuth.guard.js";
import { GetMyVisitorsEndpoint } from "@argazi/rest-api-spec";

export const GetMyVisitorsHandler = Handler.make(
  GetMyVisitorsEndpoint,
  BearerAuthGuard((_, { idInitiator }) =>
    GetUsersVisitorsUseCase(
      {
        idInitiator,
        payload: {
          idUser: idInitiator,
        },
      },
      { includeDeleted: false }
    )
  )
);
