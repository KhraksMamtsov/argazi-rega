import { Schema } from "effect";

export class HttpApiUnauthorizedError extends Schema.TaggedError<HttpApiUnauthorizedError>()(
  "HttpApiUnauthorizedError",
  {}
) {}
export class HttpApiUnexpectedServerError extends Schema.TaggedError<HttpApiUnexpectedServerError>()(
  "HttpApiUnexpectedServerError",
  {}
) {}
