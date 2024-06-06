import { Effect, Redacted, pipe } from "effect";
import { HttpError } from "effect-http";

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
      const { sub } = yield* pipe(
        JwtServiceTag.verifyAndDecode({
          token: Redacted.make(security),
          type: "accessToken",
        }),
        Effect.mapError((verifyError) =>
          HttpError.unauthorizedError(verifyError)
        )
      );

      return yield* handler(parameters, { idInitiator: sub });
    }).pipe(
      Effect.tapBoth({
        onFailure: Effect.logError,
        onSuccess: Effect.logInfo,
      })
    );
