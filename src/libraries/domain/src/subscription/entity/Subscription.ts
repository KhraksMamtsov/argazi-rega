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

export interface SubscriptionBase
  extends Schema.Schema.Type<typeof SubscriptionBaseSchema> {}

const _SubscriptionSchema = SubscriptionBaseSchema.pipe(
  //
  Schema.extend(BaseSchema),
  Schema.identifier("SubscriptionSchema")
);

export interface Subscription
  extends Schema.Schema.Type<typeof _SubscriptionSchema> {}

export const SubscriptionSchema: Schema.Schema<Subscription> =
  Schema.typeSchema(_SubscriptionSchema);
