import { Effect } from "effect";
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
  readonly expiresIn: string;
  readonly key: string;
  readonly payload: Json.JsonRecord;
}) =>
  Effect.async<string, JwtSignError>((cont) => {
    JWT.sign(
      args.payload,
      args.key,
      { algorithm: "HS256", expiresIn: args.expiresIn },
      (cause, jwt) => {
        cause !== null
          ? cont(Effect.fail(new JwtSignError({ cause })))
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            cont(Effect.succeed(jwt!));
      }
    );
  });

export const verifyAndDecode = (args: {
  readonly key: string;
  readonly token: string;
}) =>
  Effect.async<JWT.JwtPayload, JwtVerifyError>((cont) => {
    JWT.verify(
      args.token,
      args.key,
      {
        algorithms: ["HS256"],
        complete: false,
      },
      (cause, jwt) => {
        cause !== null
          ? cont(Effect.fail(new JwtVerifyError({ cause })))
          : cont(Effect.succeed(jwt as JWT.JwtPayload));
      }
    );
  });
