import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
  UrlParams,
} from "@effect/platform";
import { Schema } from "effect";
import { Config, Effect, Redacted } from "effect";

import { IdDwbn } from "@argazi/domain";
import { _JWTSchema } from "@argazi/shared";

export const DwbnOAuth2Service = Effect.gen(function* () {
  const clientId = yield* Config.redacted("DWBN_SSO_CLIENT_ID");
  const dwbnOauth2URL = yield* Config.redacted(
    Config.url("DWBN_SSO_OAUTH2_URL")
  );
  const redirectURL = yield* Config.redacted(
    Config.url("DWBN_SSO_REDIRECT_URL")
  );

  const client = yield* HttpClient.HttpClient.pipe(
    Effect.map(
      HttpClient.mapRequest(
        HttpClientRequest.setUrl(Redacted.value(dwbnOauth2URL))
      )
    )
  );

  return {
    fetchToken: (code: string) => {
      const urlParams = UrlParams.fromInput({
        client_id: Redacted.value(clientId),
        code: code,
        grant_type: "authorization_code",
        redirect_uri: Redacted.value(redirectURL).toString(),
      });

      return HttpClientRequest.post("token/").pipe(
        HttpClientRequest.appendUrlParams(urlParams),
        client.execute,
        Effect.flatMap(
          HttpClientResponse.schemaBodyJson(
            Schema.Struct({
              id_token: Schema.compose(
                _JWTSchema.JWTStruct,
                Schema.Tuple(
                  Schema.String,
                  Schema.parseJson(
                    Schema.Struct({
                      email: Schema.String,
                      family_name: Schema.String,
                      given_name: Schema.String,
                      sub: IdDwbn,
                    })
                  ),
                  Schema.String
                )
              ),
            })
          )
        ),
        Effect.scoped
      );
    },
  };
});
