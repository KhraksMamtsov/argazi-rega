import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
  UrlParams,
} from "@effect/platform";
import { Schema } from "@effect/schema";
import { Config, Effect, Record, Redacted, pipe } from "effect";

import { IdDwbn } from "@argazi/domain";
import { _JWTSchema } from "@argazi/shared";

export const DwbnOAuth2Service = Effect.gen(function* () {
  const config = yield* pipe(
    Effect.all({
      clientId: Config.redacted("DWBN_SSO_CLIENT_ID"),
      dwbnOauth2URL: Config.redacted("DWBN_SSO_OAUTH2_URL"),
      redirectURL: Config.redacted("DWBN_SSO_REDIRECT_URL"),
    }),
    Effect.map(Record.map(Redacted.value))
  );

  const defaultClient = yield* HttpClient.HttpClient;
  const clientWithBaseUrl = defaultClient.pipe(
    // HttpClient.client.filterStatusOk,
    HttpClient.mapRequest(HttpClientRequest.prependUrl(config.dwbnOauth2URL))
  );

  return {
    fetchToken: (code: string) => {
      const urlParams = UrlParams.fromInput({
        client_id: config.clientId,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: config.redirectURL,
      });

      return HttpClientRequest.post("token/").pipe(
        HttpClientRequest.urlParamsBody(urlParams),
        clientWithBaseUrl,
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
        )
      );
    },
  };
});
