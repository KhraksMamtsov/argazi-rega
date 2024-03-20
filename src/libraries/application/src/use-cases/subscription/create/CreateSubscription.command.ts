import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../common/Base.command.js";
import { IdPlaceSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const CreateSubscriptionCommandPayloadSchema = Schema.struct({
	idPlace: IdPlaceSchema,
	idUser: IdUserSchema,
}).pipe(
	_SS.satisfies.from.json(),
	Schema.identifier("CreateSubscriptionCommandPayloadSchema")
);

export const CreateSubscriptionCommandSchema = BaseCausedCommandFor(
	CreateSubscriptionCommandPayloadSchema
).pipe(Schema.identifier("CreateSubscriptionCommandSchema"));
