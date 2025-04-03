import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";
import { IdSubscription } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import type { SubscriptionBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

// #region SubscriptionApi
const _SubscriptionApi = Schema.Struct({
  id: IdSubscription,
  idPlace: IdPlace,
  idUser: IdUser,
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<SubscriptionBase>(),
  Schema.annotations({ identifier: "SubscriptionApi" })
);

export type SubscriptionApiContext = Schema.Schema.Context<
  typeof _SubscriptionApi
>;
export interface SubscriptionApiEncoded
  extends Schema.Schema.Encoded<typeof _SubscriptionApi> {}
export interface SubscriptionApi
  extends Schema.Schema.Type<typeof _SubscriptionApi> {}

export const SubscriptionApi: Schema.Schema<
  SubscriptionApi,
  SubscriptionApiEncoded
> = _SubscriptionApi;
// #endregion SubscriptionApi
