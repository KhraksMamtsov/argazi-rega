import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdPlaceSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

// #region CreateUserSubscriptionResponseBody
const _CreateUserSubscriptionResponseBodySchema = SubscriptionApiSchema.pipe(
	Schema.identifier("CreateUserSubscriptionResponseBody"),
	BaseResponseFor
);

export type CreateUserSubscriptionResponseBodyContext = Schema.Schema.Context<
	typeof _CreateUserSubscriptionResponseBodySchema
>;
export interface CreateUserSubscriptionResponseBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _CreateUserSubscriptionResponseBodySchema
	> {}
export interface CreateUserSubscriptionResponseBody
	extends Schema.Schema.Type<
		typeof _CreateUserSubscriptionResponseBodySchema
	> {}

export const CreateUserSubscriptionResponseBodySchema: Schema.Schema<
	CreateUserSubscriptionResponseBody,
	CreateUserSubscriptionResponseBodyEncoded
> = _CreateUserSubscriptionResponseBodySchema;
// #endregion CreateUserSubscriptionResponseBodySchema

// #region CreateUserSubscriptionRequestBody
const _CreateUserSubscriptionRequestBodySchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(Schema.identifier("CreateUserSubscriptionRequestBodySchema"));

export type CreateUserSubscriptionRequestBodyContext = Schema.Schema.Context<
	typeof _CreateUserSubscriptionRequestBodySchema
>;
export interface CreateUserSubscriptionRequestBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _CreateUserSubscriptionRequestBodySchema
	> {}
export interface CreateUserSubscriptionRequestBody
	extends Schema.Schema.Type<typeof _CreateUserSubscriptionRequestBodySchema> {}

export const CreateUserSubscriptionRequestBodySchema: Schema.Schema<
	CreateUserSubscriptionRequestBody,
	CreateUserSubscriptionRequestBodyEncoded
> = _CreateUserSubscriptionRequestBodySchema;
// #endregion CreateUserSubscriptionRequestBodySchema
// #region CreateUserSubscriptionRequestParams
const _CreateUserSubscriptionRequestParamsSchema = Schema.struct({
	idUser: IdUserSchema,
}).pipe(Schema.identifier("CreateUserSubscriptionRequestParamsSchema"));

export type CreateUserSubscriptionRequestParamsContext = Schema.Schema.Context<
	typeof _CreateUserSubscriptionRequestParamsSchema
>;
export interface CreateUserSubscriptionRequestParamsEncoded
	extends Schema.Schema.Encoded<
		typeof _CreateUserSubscriptionRequestParamsSchema
	> {}
export interface CreateUserSubscriptionRequestParams
	extends Schema.Schema.Type<
		typeof _CreateUserSubscriptionRequestParamsSchema
	> {}

export const CreateUserSubscriptionRequestParamsSchema: Schema.Schema<
	CreateUserSubscriptionRequestParams,
	CreateUserSubscriptionRequestParamsEncoded
> = _CreateUserSubscriptionRequestParamsSchema;
// #endregion CreateUserSubscriptionRequestParamsSchema

export const CreateUserSubscriptionEndpoint = ApiEndpoint.post(
	"createUserSubscription",
	"/users/:idUser/subscriptions",
	{
		summary: "Subscribe user on events of some place",
	}
).pipe(
	ApiEndpoint.setRequestBody(CreateUserSubscriptionRequestBodySchema),
	ApiEndpoint.setRequestPath(CreateUserSubscriptionRequestParamsSchema),
	ApiEndpoint.setResponseBody(CreateUserSubscriptionResponseBodySchema)
);
