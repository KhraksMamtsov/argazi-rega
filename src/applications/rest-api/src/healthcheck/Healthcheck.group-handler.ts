import { Effect } from "effect";
import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { NotificationServiceTag } from "@argazi/domain";
import { PrismaServiceTag } from "@argazi/database";

export const HealthCheckPingHandlerLive = HttpApiBuilder.handler(
  RestApiSpec,
  "HealthCheck",
  "healthCheckPing",
  ({ urlParams }) =>
    Effect.gen(function* () {
      const result = urlParams.echo ?? "pong";

      yield* Effect.all([
        //
        NotificationServiceTag.healthCheck,
        PrismaServiceTag.queryRaw`SELECT 1`,
      ]);

      return result;
    }).pipe(Effect.orDie)
);

export const HealthCheckGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "HealthCheck",
  (handlers) => handlers.handle("healthCheckPing", HealthCheckPingHandlerLive)
);
