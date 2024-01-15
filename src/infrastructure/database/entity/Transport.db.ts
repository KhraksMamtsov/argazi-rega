import { Schema } from "@effect/schema";
import { type Transport as _Transport } from "@prisma/client";
import { Effect } from "effect";

import { IdTransportSchema } from "../../../domain/transport/entity/IdTransport.js";
import { TransportSchema } from "../../../domain/transport/entity/Transport.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";

export type TransportDbFrom = Readonly<_Transport>;

export const TransportDbSchema = Schema.struct({
	color: Schema.Trim.pipe(Schema.nonEmpty()),
	id: IdTransportSchema,
	idUser: IdUserSchema,
	model: Schema.optionFromNullable(Schema.Secret),
	number: Schema.Secret,
	seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
	Schema.extend(BaseDbSchema),
	Schema.identifier("TransportDbSchema"),
	satisfies.from<TransportDbFrom>()
);

export const ToDomainSchema = transform(
	TransportDbSchema,
	TransportSchema,
	Effect.succeed,
	Effect.succeed
);
