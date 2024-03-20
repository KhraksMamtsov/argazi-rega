import * as Schema from "@effect/schema/Schema";

import { IdEventSchema } from "../../../libraries/domain/src/event/entity/IdEvent.js";
import { IdPlaceSchema } from "../../../libraries/domain/src/place/entity/IdPlace.js";
import { PriceSchema } from "../../../libraries/domain/src/value-objects/Price.js";
import { _SS } from "@argazi/shared";

import type { EventBase } from "../../../libraries/domain/src/event/entity/Event.js";

export const _EventApi = Schema.struct({
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

export interface EventApiEncoded
	extends Schema.Schema.Encoded<typeof _EventApi> {}
export interface EventApi extends Schema.Schema.Type<typeof _EventApi> {}

export const EventApi: Schema.Schema<EventApi, EventApiEncoded> = _EventApi;
