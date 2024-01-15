import { HttpClient } from "@effect/platform";
import * as UrlParams from "@effect/platform/Http/UrlParams";
import { Schema } from "@effect/schema";
import { Config, Effect, ReadonlyRecord, Secret } from "effect";

import { IdDwbnSchema } from "../../../../domain/user/entity/IdDwbn.js";
import { JWTStructSchema } from "../../../../libs/JWTSchema.js";

export const DwbnOAuth2Service = Effect.gen(function* (_) {
	const config = yield* _(
		Effect.all({
			clientId: Config.secret("DWBN_SSO_CLIENT_ID"),
			dwbnOauth2URL: Config.secret("DWBN_SSO_OAUTH2_URL"),
			redirectURL: Config.secret("DWBN_SSO_REDIRECT_URL"),
		}),
		Effect.map(ReadonlyRecord.map(Secret.value))
	);

	const defaultClient = yield* _(HttpClient.client.Client);
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
						Schema.struct({
							id_token: Schema.compose(
								JWTStructSchema,
								Schema.tuple(
									Schema.string,
									Schema.parseJson(
										Schema.struct({
											email: Schema.string,
											family_name: Schema.string,
											given_name: Schema.string,
											sub: IdDwbnSchema,
										})
									),
									Schema.string
								)
							),
						})
					)
				)
			);
		},
	};
});
