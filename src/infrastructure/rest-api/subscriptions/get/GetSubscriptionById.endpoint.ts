import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { IdSubscriptionSchema } from "../../../../domain/subscription/entity/IdSubscription.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../Subscription.api.js";

// #region GetSubscriptionByIdResponseBody
const _GetSubscriptionByIdResponseBodySchema = SubscriptionApiSchema.pipe(
	Schema.identifier("GetSubscriptionByIdResponseBodySchema"),
	BaseResponseFor
);

export type GetSubscriptionByIdResponseBodyContext = Schema.Schema.Context<
	typeof _GetSubscriptionByIdResponseBodySchema
>;
export interface GetSubscriptionByIdResponseBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _GetSubscriptionByIdResponseBodySchema
	> {}
export interface GetSubscriptionByIdResponseBody
	extends Schema.Schema.Type<typeof _GetSubscriptionByIdResponseBodySchema> {}

export const GetSubscriptionByIdResponseBodySchema: Schema.Schema<
	GetSubscriptionByIdResponseBody,
	GetSubscriptionByIdResponseBodyEncoded
> = _GetSubscriptionByIdResponseBodySchema;
// #endregion GetSubscriptionByIdResponseBodySchema

// #region GetSubscriptionByIdRequestParams
const _GetSubscriptionByIdRequestParamsSchema = Schema.struct({
	idSubscription: IdSubscriptionSchema,
}).pipe(Schema.identifier("GetSubscriptionByIdRequestParamsSchema"));

export type GetSubscriptionByIdRequestParamsContext = Schema.Schema.Context<
	typeof _GetSubscriptionByIdRequestParamsSchema
>;
export interface GetSubscriptionByIdRequestParamsEncoded
	extends Schema.Schema.Encoded<
		typeof _GetSubscriptionByIdRequestParamsSchema
	> {}
export interface GetSubscriptionByIdRequestParams
	extends Schema.Schema.Type<typeof _GetSubscriptionByIdRequestParamsSchema> {}

export const GetSubscriptionByIdRequestParamsSchema: Schema.Schema<
	GetSubscriptionByIdRequestParams,
	GetSubscriptionByIdRequestParamsEncoded
> = _GetSubscriptionByIdRequestParamsSchema;
// #endregion GetSubscriptionByIdRequestParamsSchema

export const GetSubscriptionByIdEndpoint = ApiEndpoint.get(
	"getSubscription",
	"/subscriptions/:idSubscription",
	{}
).pipe(
	ApiEndpoint.setRequestPath(GetSubscriptionByIdRequestParamsSchema),
	ApiEndpoint.setResponse(
		ApiResponse.make(200, GetSubscriptionByIdResponseBodySchema)
	),
	ApiEndpoint.addResponse(
		ApiResponse.make(
			400,
			Schema.string.pipe(Schema.description("Subscription not found"))
		)
	)
);
