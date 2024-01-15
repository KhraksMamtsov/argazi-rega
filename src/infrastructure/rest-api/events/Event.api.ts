import * as Schema from "@effect/schema/Schema";

import { IdEventSchema } from "../../../domain/event/entity/IdEvent.js";
import { IdPlaceSchema } from "../../../domain/place/entity/IdPlace.js";
import { PriceSchema } from "../../../domain/value-objects/Price.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";

import type { EventBase } from "../../../domain/event/entity/Event.js";

export const EventApi = Schema.struct({
	dateAnnouncement: Schema.compose(
		Schema.DateFromString,
		Schema.ValidDateFromSelf
	),
	dateDeadline: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
	dateFinish: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
	dateStart: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
	id: IdEventSchema,
	idPlace: IdPlaceSchema,
	name: Schema.Secret,
	priceDay: Schema.compose(Schema.BigDecimalFromNumber, PriceSchema),
	priceEvent: Schema.compose(Schema.BigDecimalFromNumber, PriceSchema),
}).pipe(
	satisfies.from.json(),
	satisfies.to<EventBase>(),
	Schema.identifier("EventApi")
);
