import { Config, Record, Redacted } from "effect";

export const TelegramAuthMiniAppURL = Config.all({
  authURI: Config.redacted("DWBN_SSO_AUTHORIZE_URL"),
  clientId: Config.redacted("DWBN_SSO_CLIENT_ID"),
  redirectURI: Config.redacted("DWBN_SSO_REDIRECT_URL"),
  scope: Config.redacted("DWBN_SSO_SCOPE"),
}).pipe(
  Config.map(Record.map(Redacted.value)),
  Config.map((x) => {
    const resultURL = new URL(x.authURI);

    resultURL.searchParams.set("redirect_uri", x.redirectURI.toString());
    resultURL.searchParams.set("response_type", "code");
    resultURL.searchParams.set("client_id", x.clientId);
    resultURL.searchParams.set("scope", x.scope);

    return resultURL;
  })
);
