import * as Schema from "@effect/schema/Schema";

import { IdPlaceSchema } from "@argazi/domain";
import { IdSubscriptionSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import type { SubscriptionBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

// #region SubscriptionApi
const _SubscriptionApiSchema = Schema.struct({
  id: IdSubscriptionSchema,
  idPlace: IdPlaceSchema,
  idUser: IdUserSchema,
}).pipe(
  _SS.satisfies.from.json(),
  _SS.satisfies.to<SubscriptionBase>(),
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
