import { Schema } from "effect";
import { Record, identity, pipe } from "effect";
import { AccessToken } from "@argazi/rest-api-spec";

// #region URLSearchParamsEnv
export class URLSearchParamsEnv extends Schema.Class<URLSearchParamsEnv>(
  "URLSearchParamsEnv"
)({
  accessToken: AccessToken,
  apiUrl: Schema.URL,
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
// #endregion URLSearchParamsEnv
