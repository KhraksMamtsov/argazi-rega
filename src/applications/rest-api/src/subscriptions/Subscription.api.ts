import * as Schema from "@effect/schema/Schema";

import { IdPlaceSchema } from "../../../libraries/domain/src/place/entity/IdPlace.js";
import { IdSubscriptionSchema } from "../../../libraries/domain/src/subscription/entity/IdSubscription.js";
import { IdUserSchema } from "../../../libraries/domain/src/user/entity/IdUser.js";
import { _SS } from "@argazi/shared";

import type { SubscriptionBase } from "../../../libraries/domain/src/subscription/entity/Subscription.js";

// #region SubscriptionApi
const _SubscriptionApiSchema = Schema.struct({
	id: IdSubscriptionSchema,
	idPlace: IdPlaceSchema,
	idUser: IdUserSchema,
}).pipe(
	satisfies.from.json(),
	satisfies.to<SubscriptionBase>(),
	Schema.identifier("SubscriptionApiSchema")
);

export type SubscriptionApiContext = Schema.Schema.Context<
	typeof _SubscriptionApiSchema
>;
export interface SubscriptionApiEncoded
	extends Schema.Schema.Encoded<typeof _SubscriptionApiSchema> {}
export interface SubscriptionApi
	extends Schema.Schema.Type<typeof _SubscriptionApiSchema> {}

export const SubscriptionApiSchema: Schema.Schema<
	SubscriptionApi,
	SubscriptionApiEncoded
> = _SubscriptionApiSchema;
// #endregion SubscriptionApiSchema
