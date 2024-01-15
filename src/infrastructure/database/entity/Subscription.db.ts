import { Schema } from "@effect/schema";
import { type Subscription as _Subscription } from "@prisma/client";
import { Effect } from "effect";

import { IdPlaceSchema } from "../../../domain/place/entity/IdPlace.js";
import { IdSubscriptionSchema } from "../../../domain/subscription/entity/IdSubscription.js";
import { SubscriptionSchema } from "../../../domain/subscription/entity/Subscription.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";

export const SubscriptionDbSchema = Schema.struct({
	id: IdSubscriptionSchema,
	idPlace: IdPlaceSchema,
	idUser: IdUserSchema,
}).pipe(
	Schema.extend(BaseDbSchema),
	Schema.identifier("SubscriptionDbSchema"),
	satisfies.from<_Subscription>()
);

export const ToDomainSchema = transform(
	SubscriptionDbSchema,
	SubscriptionSchema,
	Effect.succeed,
	Effect.succeed
);
