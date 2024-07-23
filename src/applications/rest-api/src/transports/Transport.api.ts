import * as Schema from "@effect/schema/Schema";

import { IdTransport } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import type { TransportBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

// #region TransportApi
const _TransportApi = Schema.Struct({
  color: Schema.NonEmptyString.pipe(Schema.trimmed()),
  id: IdTransport,
  idUser: IdUser,
  model: Schema.OptionFromNullOr(Schema.Redacted(Schema.String)),
  number: Schema.Redacted(Schema.String),
  seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
  _SS.satisfies.type<TransportBase>(),
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "_TransportApi" })
);

export type TransportApiContext = Schema.Schema.Context<typeof _TransportApi>;
export interface TransportApiEncoded
  extends Schema.Schema.Encoded<typeof _TransportApi> {}
export interface TransportApi
  extends Schema.Schema.Type<typeof _TransportApi> {}

export const TransportApi: Schema.Schema<TransportApi, TransportApiEncoded> =
  _TransportApi;
// #endregion TransportApi
