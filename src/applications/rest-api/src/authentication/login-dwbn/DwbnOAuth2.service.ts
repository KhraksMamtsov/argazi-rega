import { HttpClient } from "@effect/platform";
import * as UrlParams from "@effect/platform/Http/UrlParams";
import { Schema } from "@effect/schema";
import { Config, Effect, Record, Secret, pipe } from "effect";

import { IdDwbn } from "@argazi/domain";
import { _JWTSchema } from "@argazi/shared";

export const DwbnOAuth2Service = Effect.gen(function* (_) {
  const config = yield* pipe(
    Effect.all({
      clientId: Config.secret("DWBN_SSO_CLIENT_ID"),
      dwbnOauth2URL: Config.secret("DWBN_SSO_OAUTH2_URL"),
      redirectURL: Config.secret("DWBN_SSO_REDIRECT_URL"),
    }),
    Effect.map(Record.map(Secret.value))
  );

  const defaultClient = yield* HttpClient.client.Client;
  const clientWithBaseUrl = defaultClient.pipe(
    // HttpClient.client.filterStatusOk,
    HttpClient.client.mapRequest(
      HttpClient.request.prependUrl(config.dwbnOauth2URL)
    )
  );

  return {
    fetchToken: (code: string) => {
      const urlParams = UrlParams.fromInput({
        client_id: config.clientId,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: config.redirectURL,
      });

      return HttpClient.request.post("token/").pipe(
        HttpClient.request.urlParamsBody(urlParams),
        clientWithBaseUrl,
        Effect.flatMap(
          HttpClient.response.schemaBodyJson(
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
