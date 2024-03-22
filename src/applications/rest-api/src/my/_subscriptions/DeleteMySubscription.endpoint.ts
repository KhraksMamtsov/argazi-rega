import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdSubscriptionSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

// #region DeleteMySubscriptionResponseBody
const _DeleteMySubscriptionResponseBodySchema = SubscriptionApiSchema.pipe(
	Schema.identifier("DeleteMySubscriptionResponseBodySchema"),
	BaseResponseFor
);

export type DeleteMySubscriptionResponseBodyContext = Schema.Schema.Context<
	typeof _DeleteMySubscriptionResponseBodySchema
>;
export interface DeleteMySubscriptionResponseBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _DeleteMySubscriptionResponseBodySchema
	> {}
export interface DeleteMySubscriptionResponseBody
	extends Schema.Schema.Type<typeof _DeleteMySubscriptionResponseBodySchema> {}

export const DeleteMySubscriptionResponseBodySchema: Schema.Schema<
	DeleteMySubscriptionResponseBody,
	DeleteMySubscriptionResponseBodyEncoded
> = _DeleteMySubscriptionResponseBodySchema;
// #endregion DeleteMySubscriptionResponseBodySchema

// #region DeleteMySubscriptionRequestParams
const _DeleteMySubscriptionRequestParamsSchema = Schema.struct({
	idSubscription: IdSubscriptionSchema,
}).pipe(Schema.identifier("DeleteMySubscriptionRequestParamsSchema"));

export type DeleteMySubscriptionRequestParamsContext = Schema.Schema.Context<
	typeof _DeleteMySubscriptionRequestParamsSchema
>;
export interface DeleteMySubscriptionRequestParamsEncoded
	extends Schema.Schema.Encoded<
		typeof _DeleteMySubscriptionRequestParamsSchema
	> {}
export interface DeleteMySubscriptionRequestParams
	extends Schema.Schema.Type<typeof _DeleteMySubscriptionRequestParamsSchema> {}

export const DeleteMySubscriptionRequestParamsSchema: Schema.Schema<
	DeleteMySubscriptionRequestParams,
	DeleteMySubscriptionRequestParamsEncoded
> = _DeleteMySubscriptionRequestParamsSchema;
// #endregion DeleteMySubscriptionRequestParamsSchema

export const DeleteMySubscriptionEndpoint = ApiEndpoint.delete(
	"deleteMySubscription",
	"/my/subscriptions/:idSubscription",
	{
		summary: "Unsubscribe user from events of some place",
	}
).pipe(
	ApiEndpoint.setRequestPath(DeleteMySubscriptionRequestParamsSchema),
	ApiEndpoint.setResponseBody(DeleteMySubscriptionResponseBodySchema),
	ApiEndpoint.setSecurity(BearerAuth)
);
