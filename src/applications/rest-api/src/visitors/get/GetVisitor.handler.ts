import { GetVisitorByIdUseCase } from "@argazi/application";

import { IdAdmin } from "../../authentication/constants.js";
import { Effect } from "effect";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";

const GetVisitorHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "Visitor",
  "getVisitor",
  ({ path }) =>
    GetVisitorByIdUseCase({
      idInitiator: IdAdmin,
      payload: {
        idVisitor: path.idVisitor,
      },
    }).pipe(Effect.flatten, Effect.orDie)
);

export const VisitorGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "Visitor",
  (handlers) => handlers.handle("getVisitor", GetVisitorHandlerLive)
);
