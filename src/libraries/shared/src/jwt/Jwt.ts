import { Duration, Effect, Redacted } from "effect";
import { Data } from "effect";
import JWT from "jsonwebtoken";

import { Json } from "../Schema.js";

export enum JwtErrorType {
  SIGN = "SIGN::JwtErrorType",
  VERIFY = "VERIFY::JwtErrorType",
}

export class JwtSignError extends Data.TaggedError(JwtErrorType.SIGN)<{
  readonly cause: Error;
}> {}
export class JwtVerifyError extends Data.TaggedError(JwtErrorType.VERIFY)<{
  readonly cause: JWT.VerifyErrors;
}> {}

export const sign = (args: {
  readonly expiresIn: Duration.Duration;
  readonly key: Redacted.Redacted;
  readonly payload: Json.JsonRecord;
}) =>
  Effect.async<string, JwtSignError>((cont) => {
    JWT.sign(
      args.payload,
      Redacted.value(args.key),
      {
        algorithm: "HS256",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        expiresIn: `${Duration.toMillis(args.expiresIn)}Ms`,
      },
      (cause, jwt) =>
        cause !== null
          ? // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            cont(Effect.fail(new JwtSignError({ cause })))
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-confusing-void-expression
            cont(Effect.succeed(jwt!))
    );
  });

export const verifyAndDecode = (args: {
  readonly key: Redacted.Redacted;
  readonly token: Redacted.Redacted;
}) =>
  Effect.async<JWT.JwtPayload, JwtVerifyError>((cont) => {
    JWT.verify(
      Redacted.value(args.token),
      Redacted.value(args.key),
      {
        algorithms: ["HS256"],
        complete: false,
      },
      (cause, jwt) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        cause !== null
          ? cont(Effect.fail(new JwtVerifyError({ cause })))
          : cont(Effect.succeed(jwt as JWT.JwtPayload));
      }
    );
  });
