import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdPlaceSchema } from "../../../../libraries/domain/src/place/entity/IdPlace.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

// #region CreateMySubscriptionRequestBody
const _CreateMySubscriptionRequestBodySchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(Schema.identifier("CreateMySubscriptionRequestBodySchema"));

export type CreateMySubscriptionRequestBodyContext = Schema.Schema.Context<
	typeof _CreateMySubscriptionRequestBodySchema
>;
export interface CreateMySubscriptionRequestBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _CreateMySubscriptionRequestBodySchema
	> {}
export interface CreateMySubscriptionRequestBody
	extends Schema.Schema.Type<typeof _CreateMySubscriptionRequestBodySchema> {}

export const CreateMySubscriptionRequestBodySchema: Schema.Schema<
	CreateMySubscriptionRequestBody,
	CreateMySubscriptionRequestBodyEncoded
> = _CreateMySubscriptionRequestBodySchema;
// #endregion CreateMySubscriptionRequestBodySchema

export const CreateMySubscriptionResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("CreateMySubscriptionResponseSchema"),
	BaseResponseFor
);

// #region CreateMySubscriptionResponseBody
const _CreateMySubscriptionResponseBodySchema = SubscriptionApiSchema.pipe(
	Schema.identifier("_CreateMySubscriptionResponseBodySchema"),
	BaseResponseFor
);

export type CreateMySubscriptionResponseBodyContext = Schema.Schema.Context<
	typeof _CreateMySubscriptionResponseBodySchema
>;
export interface CreateMySubscriptionResponseBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _CreateMySubscriptionResponseBodySchema
	> {}
export interface CreateMySubscriptionResponseBody
	extends Schema.Schema.Type<typeof _CreateMySubscriptionResponseBodySchema> {}

export const CreateMySubscriptionResponseBodySchema: Schema.Schema<
	CreateMySubscriptionResponseBody,
	CreateMySubscriptionResponseBodyEncoded
> = _CreateMySubscriptionResponseBodySchema;
// #endregion CreateMySubscriptionResponseBodySchema

export const CreateMySubscriptionEndpoint = ApiEndpoint.post(
	"createMySubscription",
	"/my/subscriptions",
	{
		summary: "Subscribe user on events of some place",
	}
).pipe(
	ApiEndpoint.setRequestBody(CreateMySubscriptionRequestBodySchema),
	ApiEndpoint.setResponseBody(CreateMySubscriptionResponseBodySchema),
	ApiEndpoint.setSecurity(BearerAuth)
);
