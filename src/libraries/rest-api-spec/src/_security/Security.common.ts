import { HttpApiSchema } from "@effect/platform";
import { Context, Schema } from "effect";

export class JWTPayload extends Schema.Class<JWTPayload>("JWTPayload")({
  isAdmin: Schema.Boolean,
  sub: Schema.UUID,
}) {
  static encode = Schema.encode(this);
  static decode = Schema.decodeUnknown(this);
}

export class UnauthorizedHttpError extends Schema.TaggedError<UnauthorizedHttpError>()(
  "UnauthorizedHttpError",
  {},
  HttpApiSchema.annotations({ status: 401 })
) {}

export class BearerAuthenticatedSession extends Context.Tag(
  "BearerAuthenticatedSession"
)<
  BearerAuthenticatedSession,
  {
    readonly jwtPayload: JWTPayload;
  }
>() {}

export class BasicAuthenticatedSession extends Context.Tag(
  "BasicAuthenticatedSession"
)<
  BasicAuthenticatedSession,
  {
    readonly type: "admin" | "bot";
  }
>() {}
