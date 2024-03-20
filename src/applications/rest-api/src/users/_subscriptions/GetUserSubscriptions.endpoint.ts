import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdUserSchema } from "../../../../libraries/domain/src/user/entity/IdUser.js";
import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

// #region GetUserSubscriptionsResponseBody
const _GetUserSubscriptionsResponseBodySchema = SubscriptionApiSchema.pipe(
	Schema.identifier("GetUserSubscriptionsResponseBody"),
	BaseResponseManyFor
);

export type GetUserSubscriptionsResponseBodyContext = Schema.Schema.Context<
	typeof _GetUserSubscriptionsResponseBodySchema
>;
export interface GetUserSubscriptionsResponseBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _GetUserSubscriptionsResponseBodySchema
	> {}
export interface GetUserSubscriptionsResponseBody
	extends Schema.Schema.Type<typeof _GetUserSubscriptionsResponseBodySchema> {}

export const GetUserSubscriptionsResponseBodySchema: Schema.Schema<
	GetUserSubscriptionsResponseBody,
	GetUserSubscriptionsResponseBodyEncoded
> = _GetUserSubscriptionsResponseBodySchema;
// #endregion GetUserSubscriptionsResponseBodySchema

// #region GetUserSubscriptionsRequestParams
const _GetUserSubscriptionsRequestParamsSchema = Schema.struct({
	idUser: IdUserSchema,
}).pipe(Schema.identifier("GetUserSubscriptionsRequestParamsSchema"));

export type GetUserSubscriptionsRequestParamsContext = Schema.Schema.Context<
	typeof _GetUserSubscriptionsRequestParamsSchema
>;
export interface GetUserSubscriptionsRequestParamsEncoded
	extends Schema.Schema.Encoded<
		typeof _GetUserSubscriptionsRequestParamsSchema
	> {}
export interface GetUserSubscriptionsRequestParams
	extends Schema.Schema.Type<typeof _GetUserSubscriptionsRequestParamsSchema> {}

export const GetUserSubscriptionsRequestParamsSchema: Schema.Schema<
	GetUserSubscriptionsRequestParams,
	GetUserSubscriptionsRequestParamsEncoded
> = _GetUserSubscriptionsRequestParamsSchema;
// #endregion GetUserSubscriptionsRequestParamsSchema

export const GetUserSubscriptionsEndpoint = ApiEndpoint.get(
	"getUserSubscriptions",
	"/users/:idUser/subscriptions",
	{
		summary: "Get all user's subscriptions",
	}
).pipe(
	ApiEndpoint.setRequestPath(GetUserSubscriptionsRequestParamsSchema),
	ApiEndpoint.setResponseBody(GetUserSubscriptionsResponseBodySchema)
);
