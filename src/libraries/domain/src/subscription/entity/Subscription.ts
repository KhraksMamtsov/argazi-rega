import { Schema } from "effect";

import { IdSubscription } from "./IdSubscription.js";

import { Base } from "../../entities/common/Base.js";
import { IdPlace } from "../../place/entity/IdPlace.js";
import { IdUser } from "../../user/entity/IdUser.js";

export const SubscriptionBase = Schema.Struct({
  id: IdSubscription,
  idPlace: IdPlace,
  idUser: IdUser,
}).pipe(Schema.annotations({ identifier: "SubscriptionBase" }));

export interface SubscriptionBase
  extends Schema.Schema.Type<typeof SubscriptionBase> {}

const _Subscription = SubscriptionBase.pipe(
  //
  Schema.extend(Base),
  Schema.annotations({ identifier: "Subscription" })
);

export interface Subscription
  extends Schema.Schema.Type<typeof _Subscription> {}

export const Subscription: Schema.Schema<Subscription> =
  Schema.typeSchema(_Subscription);
