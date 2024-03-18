import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { BaseResponseFor } from "../BaseResponseFor.js";
import { BearerAuth } from "../BearerAuth.security-scheme.js";
import { UserApi } from "../users/User.api.js";

export const _GetMyIdentityResponseSchema = UserApi.pipe(
	Schema.identifier("GetMyIdentityResponseSchema"),
	BaseResponseFor
);

export interface GetMyIdentityResponseFrom
	extends Schema.Schema.Encoded<typeof _GetMyIdentityResponseSchema> {}
export interface GetMyIdentityResponse
	extends Schema.Schema.Type<typeof _GetMyIdentityResponseSchema> {}

export const GetMyIdentityResponseSchema: Schema.Schema<
	GetMyIdentityResponse,
	GetMyIdentityResponseFrom
> = _GetMyIdentityResponseSchema;

export const GetMyIdentityEndpoint = ApiEndpoint.get(
	"getMyIdentity",
	"/my/identity",
	{
		response: GetMyIdentityResponseSchema,
	},
	{
		security: BearerAuth,
		summary: "Get user",
	}
);
