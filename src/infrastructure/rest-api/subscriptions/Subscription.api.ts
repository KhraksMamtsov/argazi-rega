import * as Schema from "@effect/schema/Schema";

import { IdPlaceSchema } from "../../../domain/place/entity/IdPlace.js";
import { IdSubscriptionSchema } from "../../../domain/subscription/entity/IdSubscription.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";

import type { SubscriptionBase } from "../../../domain/subscription/entity/Subscription.js";

export const SubscriptionApiSchema = Schema.struct({
	id: IdSubscriptionSchema,
	idPlace: IdPlaceSchema,
	idUser: IdUserSchema,
}).pipe(
	satisfies.from.json(),
	satisfies.to<SubscriptionBase>(),
	Schema.identifier("SubscriptionApi")
);
