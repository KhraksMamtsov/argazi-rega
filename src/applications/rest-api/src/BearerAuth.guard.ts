import { Effect } from "effect";

import { IdUser } from "@argazi/domain";

import { BearerAuthenticatedSession } from "@argazi/rest-api-spec";

export const BearerAuthGuard =
  <P, A, E, R>(
    handler: (
      parameters: NoInfer<P>,
      guardResult: { readonly idInitiator: IdUser }
    ) => Effect.Effect<A, E, R>
  ) =>
  (parameters: P) =>
    Effect.gen(function* () {
      const { jwtPayload } = yield* BearerAuthenticatedSession;

      return yield* handler(parameters, {
        idInitiator: IdUser.make(jwtPayload.sub),
      });
    });
