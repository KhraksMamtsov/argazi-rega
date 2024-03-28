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
  (parameters: P, security: string) =>
    Effect.gen(function* (_) {
      const { sub } = yield* _(
        JwtServiceTag.verifyAndDecode({
          token: Secret.fromString(security),
          type: "accessToken",
        }),
        Effect.mapError((verifyError) =>
          ServerError.unauthorizedError(verifyError)
        )
      );

      return yield* _(handler(parameters, { idInitiator: sub }));
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    );
