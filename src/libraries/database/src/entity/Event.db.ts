import { Schema } from "@effect/schema";
import { type Event as _Event } from "@prisma/client";
import { Effect } from "effect";

import {
  EventSchema,
  IdEventSchema,
  IdPlaceSchema,
  PriceSchema,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";
import { BigDecimalFromPrismaDecimal } from "../PrismaDecimalSchema.js";

export const EventDbSchema = Schema.Struct({
  dateAnnouncement: Schema.ValidDateFromSelf,
  dateDeadline: Schema.ValidDateFromSelf,
  dateFinish: Schema.ValidDateFromSelf,
  dateStart: Schema.ValidDateFromSelf,
  id: IdEventSchema,
  idPlace: IdPlaceSchema,
  name: Schema.Secret,
  priceDay: Schema.compose(BigDecimalFromPrismaDecimal, PriceSchema),
  priceEvent: Schema.compose(BigDecimalFromPrismaDecimal, PriceSchema),
  description: Schema.String,
}).pipe(
  Schema.extend(BaseDbSchema),
  Schema.identifier("EventDbSchema"),
  _SS.satisfies.from<_Event>()
);

export const EventDbToDomainSchema = transform(
  EventDbSchema,
  EventSchema,
  Effect.succeed,
  Effect.succeed
);
