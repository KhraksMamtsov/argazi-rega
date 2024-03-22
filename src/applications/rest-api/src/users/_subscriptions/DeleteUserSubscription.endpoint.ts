import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdSubscriptionSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

// #region DeleteUserSubscriptionResponseBody
const _DeleteUserSubscriptionResponseBodySchema = SubscriptionApiSchema.pipe(
	Schema.identifier("_DeleteUserSubscriptionResponseBodySchema"),
	BaseResponseFor
);

export type DeleteUserSubscriptionResponseBodyContext = Schema.Schema.Context<
	typeof _DeleteUserSubscriptionResponseBodySchema
>;
export interface DeleteUserSubscriptionResponseBodyEncoded
	extends Schema.Schema.Encoded<
		typeof _DeleteUserSubscriptionResponseBodySchema
	> {}
export interface DeleteUserSubscriptionResponseBody
	extends Schema.Schema.Type<
		typeof _DeleteUserSubscriptionResponseBodySchema
	> {}

export const DeleteUserSubscriptionResponseBodySchema: Schema.Schema<
	DeleteUserSubscriptionResponseBody,
	DeleteUserSubscriptionResponseBodyEncoded
> = _DeleteUserSubscriptionResponseBodySchema;
// #endregion DeleteUserSubscriptionResponseBodySchema

// #region DeleteUserSubscriptionRequestParams
const _DeleteUserSubscriptionRequestParamsSchema = Schema.struct({
	idSubscription: IdSubscriptionSchema,
	idUser: IdUserSchema,
}).pipe(Schema.identifier("DeleteUserSubscriptionRequestParamsSchema"));

export type DeleteUserSubscriptionRequestParamsContext = Schema.Schema.Context<
	typeof _DeleteUserSubscriptionRequestParamsSchema
>;
export interface DeleteUserSubscriptionRequestParamsEncoded
	extends Schema.Schema.Encoded<
		typeof _DeleteUserSubscriptionRequestParamsSchema
	> {}
export interface DeleteUserSubscriptionRequestParams
	extends Schema.Schema.Type<
		typeof _DeleteUserSubscriptionRequestParamsSchema
	> {}

export const DeleteUserSubscriptionRequestParamsSchema: Schema.Schema<
	DeleteUserSubscriptionRequestParams,
	DeleteUserSubscriptionRequestParamsEncoded
> = _DeleteUserSubscriptionRequestParamsSchema;
// #endregion DeleteUserSubscriptionRequestParamsSchema

export const DeleteUserSubscriptionEndpoint = ApiEndpoint.delete(
	"deleteUserSubscription",
	"/users/:idUser/subscriptions/:idSubscription",
	{
		summary: "Unsubscribe user from events of some place",
	}
).pipe(
	ApiEndpoint.setRequestPath(DeleteUserSubscriptionRequestParamsSchema),
	ApiEndpoint.setResponseBody(DeleteUserSubscriptionResponseBodySchema)
);
