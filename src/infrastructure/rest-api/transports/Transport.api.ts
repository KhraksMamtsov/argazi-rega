import * as Schema from "@effect/schema/Schema";

import { IdTransportSchema } from "../../../domain/transport/entity/IdTransport.js";
import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";

import type { TransportBase } from "../../../domain/transport/entity/Transport.js";

export const TransportApi = Schema.struct({
	color: Schema.NonEmpty.pipe(Schema.trimmed()),
	id: IdTransportSchema,
	idUser: IdUserSchema,
	model: Schema.optionFromNullable(Schema.Secret),
	number: Schema.Secret,
	seatsNumber: Schema.Int.pipe(Schema.positive()),
}).pipe(
	satisfies.to<TransportBase>(),
	satisfies.from.json(),
	Schema.identifier("TransportApi")
);
