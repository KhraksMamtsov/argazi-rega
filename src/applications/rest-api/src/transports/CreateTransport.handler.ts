import { Handler } from "effect-http";
import { Effect } from "effect";
import { CreateTransportUseCase } from "@argazi/application";
import { IdAdmin } from "../authentication/constants.js";
import { CreateTransportEndpoint } from "./CreateTransport.endpoint.js";

export const CreateTransportHandler = Handler.make(
  CreateTransportEndpoint,
  ({ body }) =>
    Effect.gen(function* () {
      const newTransport = yield* CreateTransportUseCase({
        idInitiator: IdAdmin,
        payload: body,
      });

      return newTransport;
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    )
);
