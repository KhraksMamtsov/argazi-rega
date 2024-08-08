import { GetVisitorByIdUseCase } from "@argazi/application";
import { Handler, HttpError } from "effect-http";
import { IdAdmin } from "../../authentication/constants.js";
import { Effect } from "effect";
import { GetVisitorEndpoint } from "./GetVisitor.endpoint.js";

export const GetVisitorHandler = Handler.make(GetVisitorEndpoint, ({ path }) =>
  GetVisitorByIdUseCase({
    idInitiator: IdAdmin,
    payload: {
      idVisitor: path.idVisitor,
    },
  }).pipe(
    Effect.flatten,
    Effect.mapError(() => HttpError.notFound("NotFound1"))
  )
);
