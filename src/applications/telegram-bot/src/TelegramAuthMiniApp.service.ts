import { Config, Effect, Redacted } from "effect";

export const TelegramAuthMiniAppURL = Effect.gen(function* () {
  const authURI = yield* Config.url("DWBN_SSO_AUTHORIZE_URL");
  const clientId = yield* Config.redacted("DWBN_SSO_CLIENT_ID");
  const redirectURI = yield* Config.url("DWBN_SSO_REDIRECT_URL");
  const scope = yield* Config.string("DWBN_SSO_SCOPE");

  const resultURL = new URL(authURI);

  resultURL.searchParams.set("redirect_uri", redirectURI.toString());
  resultURL.searchParams.set("response_type", "code");
  resultURL.searchParams.set("client_id", Redacted.value(clientId));
  resultURL.searchParams.set("scope", scope);

  return resultURL;
});
