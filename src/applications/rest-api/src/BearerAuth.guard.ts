import { Effect, Secret } from "effect";
import { ServerError } from "effect-http";

import type { IdUser } from "@argazi/domain";

import { JwtServiceTag } from "./authentication/Jwt.service.js";

export const BearerAuthGuard =
  <P, A, E, R>(
    handler: (
      parameters: P,
      guardResult: { readonly idInitiator: IdUser }
    ) => Effect.Effect<A, E, R>
  ) =>
  <
    S extends {
      readonly bearer: { readonly token: Secret.Secret };
    },
  >(
    parameters: P,
    security: S
  ) =>
    Effect.gen(function* (_) {
      const { sub } = yield* _(
        JwtServiceTag.verifyAndDecode({
          token: security.bearer.token,
          type: "accessToken",
        }),
        Effect.mapError((verifyError) =>
          ServerError.unauthorizedError(verifyError)
        )
      );

      return yield* _(handler(parameters, { idInitiator: sub }));
    });
