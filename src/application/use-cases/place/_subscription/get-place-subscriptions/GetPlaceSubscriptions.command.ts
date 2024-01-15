import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "../../../../../domain/place/entity/IdPlace.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export type GetPlaceSubscriptionsCommandPayloadFrom = {
	readonly idPlace: string;
};

export const GetPlaceSubscriptionsCommandPayloadSchema = Schema.struct({
	idPlace: IdPlaceSchema,
}).pipe(
	satisfies.from.json<GetPlaceSubscriptionsCommandPayloadFrom>(),
	Schema.identifier("GetPlaceSubscriptionsCommandPayloadSchema")
);

export const GetPlaceSubscriptionsCommandSchema = BaseCausedCommandFor(
	GetPlaceSubscriptionsCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceSubscriptionsCommandSchema"));
