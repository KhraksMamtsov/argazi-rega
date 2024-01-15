import { Schema } from "@effect/schema";
import { type Event as _Event } from "@prisma/client";
import { Effect } from "effect";

import { EventSchema } from "../../../domain/event/entity/Event.js";
import { IdEventSchema } from "../../../domain/event/entity/IdEvent.js";
import { IdPlaceSchema } from "../../../domain/place/entity/IdPlace.js";
import { PriceSchema } from "../../../domain/value-objects/Price.js";
import { satisfies } from "../../../libs/SchemaSatisfy.js";
import { BaseDbSchema, transform } from "../Base.db.js";
import { BigDecimalFromPrismaDecimal } from "../PrismaDecimalSchema.js";

export const EventDbSchema = Schema.struct({
	dateAnnouncement: Schema.ValidDateFromSelf,
	dateDeadline: Schema.ValidDateFromSelf,
	dateFinish: Schema.ValidDateFromSelf,
	dateStart: Schema.ValidDateFromSelf,
	id: IdEventSchema,
	idPlace: IdPlaceSchema,
	name: Schema.Secret,
	priceDay: Schema.compose(BigDecimalFromPrismaDecimal, PriceSchema),
	priceEvent: Schema.compose(BigDecimalFromPrismaDecimal, PriceSchema),
}).pipe(
	Schema.extend(BaseDbSchema),
	Schema.identifier("EventDbSchema"),
	satisfies.from<_Event>()
);

export const ToDomainSchema = transform(
	EventDbSchema,
	EventSchema,
	Effect.succeed,
	Effect.succeed
);
