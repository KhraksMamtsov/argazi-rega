import * as Schema from "@effect/schema/Schema";

import { IdTransportSchema } from "../../../libraries/domain/src/transport/entity/IdTransport.js";
import { IdUserSchema } from "../../../libraries/domain/src/user/entity/IdUser.js";
import { _SS } from "@argazi/shared";

import type { TransportBase } from "../../../libraries/domain/src/transport/entity/Transport.js";

// #region TransportApi
const _TransportApiSchema = Schema.struct({
	color: Schema.NonEmpty.pipe(Schema.trimmed()),
	id: IdTransportSchema,
	idUser: IdUserSchema,
	model: Schema.optionFromNullable(Schema.Secret),
	number: Schema.Secret,
	seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
	satisfies.to<TransportBase>(),
	satisfies.from.json(),
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
