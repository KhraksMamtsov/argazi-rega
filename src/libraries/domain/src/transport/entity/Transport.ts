import { Schema } from "@effect/schema";

import { IdTransportSchema } from "./IdTransport.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdUserSchema } from "../../user/entity/IdUser.js";

export const TransportBaseSchema = Schema.struct({
	color: Schema.string.pipe(Schema.trimmed(), Schema.nonEmpty()),
	id: IdTransportSchema,
	idUser: IdUserSchema,
	model: Schema.SecretFromSelf.pipe(Schema.optionFromSelf),
	//
	number: Schema.SecretFromSelf,
	seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(Schema.typeSchema, Schema.identifier("TransportBaseSchema"));

export interface TransportBase
	extends Schema.Schema.Type<typeof TransportBaseSchema> {}

export const _TransportSchema = TransportBaseSchema.pipe(
	Schema.extend(BaseSchema),
	Schema.identifier("TransportSchema")
);

export interface Transport
	extends Schema.Schema.Type<typeof _TransportSchema> {}

export const TransportSchema: Schema.Schema<Transport> = _TransportSchema;
