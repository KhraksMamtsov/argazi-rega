import * as Schema from "@effect/schema/Schema";
import { Api } from "effect-http";

import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const GetMySubscriptionsRequest = {};

export const _GetMySubscriptionsResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("GetMySubscriptionsResponseSchema"),
	BaseResponseManyFor
);

export interface GetMySubscriptionsResponseFrom
	extends Schema.Schema.Encoded<typeof _GetMySubscriptionsResponseSchema> {}
export interface GetMySubscriptionsResponse
	extends Schema.Schema.Type<typeof _GetMySubscriptionsResponseSchema> {}

export const GetMySubscriptionsResponseSchema: Schema.Schema<
	GetMySubscriptionsResponse,
	GetMySubscriptionsResponseFrom
> = _GetMySubscriptionsResponseSchema;

export const GetMySubscriptionsResponse = GetMySubscriptionsResponseSchema.pipe(
	Schema.description("UserSubscriptions")
);

export const GetMySubscriptionsEndpoint = ApiEndpoint.get(
	"getMySubscriptions",
	"/my/subscriptions",
	{
		request: GetMySubscriptionsRequest,
		response: GetMySubscriptionsResponse,
	},
	{
		security: BearerAuth,
		summary: "Get all user's subscriptions",
	}
);
