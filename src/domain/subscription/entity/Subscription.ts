import { Schema } from "@effect/schema";

import { IdSubscriptionSchema } from "./IdSubscription.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdPlaceSchema } from "../../place/entity/IdPlace.js";
import { IdUserSchema } from "../../user/entity/IdUser.js";

export const SubscriptionBaseSchema = Schema.struct({
	id: IdSubscriptionSchema,
	idPlace: IdPlaceSchema,
	idUser: IdUserSchema,
});

export type SubscriptionBase = Schema.Schema.To<typeof SubscriptionBaseSchema>;

const _SubscriptionSchema = SubscriptionBaseSchema.pipe(
	//
	Schema.extend(BaseSchema),
	Schema.identifier("SubscriptionSchema")
);

export type Subscription = Schema.Schema.To<typeof _SubscriptionSchema>;

export const SubscriptionSchema: Schema.Schema<Subscription> =
	Schema.to(_SubscriptionSchema);
