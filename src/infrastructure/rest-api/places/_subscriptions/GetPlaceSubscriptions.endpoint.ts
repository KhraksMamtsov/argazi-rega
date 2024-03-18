import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseManyFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../../subscriptions/Subscription.api.js";

export const GetPlaceSubscriptionsResponseSchema = SubscriptionApiSchema.pipe(
	Schema.identifier("GetPlaceSubscriptionsResponseSchema"),
	BaseResponseManyFor
);

// #region GetPlaceSubscriptionsRequestPath
const _GetPlaceSubscriptionsRequestPathSchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(Schema.identifier("GetPlaceSubscriptionsRequestPathSchema"));

export type GetPlaceSubscriptionsRequestPathContext = Schema.Schema.Context<
	typeof _GetPlaceSubscriptionsRequestPathSchema
>;
export interface GetPlaceSubscriptionsRequestPathEncoded
	extends Schema.Schema.Encoded<
		typeof _GetPlaceSubscriptionsRequestPathSchema
	> {}
export interface GetPlaceSubscriptionsRequestPath
	extends Schema.Schema.Type<typeof _GetPlaceSubscriptionsRequestPathSchema> {}

export const GetPlaceSubscriptionsRequestPathSchema: Schema.Schema<
	GetPlaceSubscriptionsRequestPath,
	GetPlaceSubscriptionsRequestPathEncoded
> = _GetPlaceSubscriptionsRequestPathSchema;
// #endregion GetPlaceSubscriptionsRequestPathSchema

export const GetPlaceSubscriptionsEndpoint = ApiEndpoint.get(
	"getPlaceSubscriptions",
	"/places/:idPlace/subscriptions",
	{}
).pipe(
	ApiEndpoint.setRequestPath(GetPlaceSubscriptionsRequestPathSchema),
	ApiEndpoint.setResponse(
		ApiResponse.make(200, GetPlaceSubscriptionsResponseSchema)
	),
	ApiEndpoint.addResponse(
		ApiResponse.make(
			404,
			Schema.string.pipe(Schema.description("PlaceSubscriptions not found"))
		)
	)
);
