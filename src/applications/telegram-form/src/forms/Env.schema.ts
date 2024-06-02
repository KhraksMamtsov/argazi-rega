import { Schema } from "@effect/schema";
import { Record, identity, pipe } from "effect";
import type { Simplify } from "effect/Types";
import { AccessToken } from "@argazi/rest-api/AccessToken";
import * as Schema_ from "@argazi/shared/Schema";

// #region URLSearchParamsEnv
export class URLSearchParamsEnv extends Schema.Class<URLSearchParamsEnv>(
  "URLSearchParamsEnv"
)({
  accessToken: AccessToken,
  apiUrl: Schema_.URLFromString,
}) {
  static decode = Schema.decodeUnknownEither(this);
  static fromURL = (url: URL) =>
    pipe(
      //
      url.searchParams.entries(),
      Record.fromIterableWith(identity),
      (_) => this.decode(_)
    );
}

export declare namespace URLSearchParamsEnv {
  export type Context = Schema.Schema.Context<typeof URLSearchParamsEnv>;
  export type EncodedType = typeof URLSearchParamsEnv.Encoded;
  export interface Encoded extends EncodedType {}
  export type Type = Simplify<typeof URLSearchParamsEnv.Type>;
}
// #endregion URLSearchParamsEnv
