import { Schema } from "@effect/schema";

import { IdEventSchema } from "./IdEvent.js";

import { BaseSchema } from "../../entities/common/Base.js";
import { IdPlaceSchema } from "../../place/entity/IdPlace.js";
import { PriceSchema } from "../../value-objects/Price.js";

export const EventBaseSchema = Schema.struct({
	dateAnnouncement: Schema.ValidDateFromSelf,
	dateDeadline: Schema.ValidDateFromSelf,
	dateFinish: Schema.ValidDateFromSelf,
	dateStart: Schema.ValidDateFromSelf,
	id: IdEventSchema,
	idPlace: IdPlaceSchema,
	name: Schema.SecretFromSelf,
	priceDay: PriceSchema,
	priceEvent: PriceSchema,
});

export type EventBase = Schema.Schema.To<typeof EventBaseSchema>;

const _EventSchema = EventBaseSchema.pipe(
	//
	Schema.extend(BaseSchema),
	Schema.identifier("EventSchema")
);

export type Event = Schema.Schema.To<typeof _EventSchema>;

export const EventSchema: Schema.Schema<Event> = Schema.to(_EventSchema);
