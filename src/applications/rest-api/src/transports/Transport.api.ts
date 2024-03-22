import * as Schema from "@effect/schema/Schema";

import { IdTransportSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import type { TransportBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

// #region TransportApi
const _TransportApiSchema = Schema.struct({
  color: Schema.NonEmpty.pipe(Schema.trimmed()),
  id: IdTransportSchema,
  idUser: IdUserSchema,
  model: Schema.optionFromNullable(Schema.Secret),
  number: Schema.Secret,
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
  _SS.satisfies.to<TransportBase>(),
  _SS.satisfies.from.json(),
  Schema.identifier("_TransportApiSchema")
);

export type TransportApiContext = Schema.Schema.Context<
  typeof _TransportApiSchema
>;
export interface TransportApiEncoded
  extends Schema.Schema.Encoded<typeof _TransportApiSchema> {}
export interface TransportApi
  extends Schema.Schema.Type<typeof _TransportApiSchema> {}

export const TransportApiSchema: Schema.Schema<
  TransportApi,
  TransportApiEncoded
> = _TransportApiSchema;
// #endregion TransportApiSchema
