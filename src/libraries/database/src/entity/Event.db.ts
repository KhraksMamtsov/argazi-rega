import { Schema } from "@effect/schema";
import { type Event as _Event } from "@prisma/client";
import { Effect } from "effect";

import { Event, IdEvent, IdPlace, Price } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";
import { BigDecimalFromPrismaDecimal } from "../PrismaDecimalSchema.js";

export const EventDb = Schema.Struct({
  dateAnnouncement: Schema.ValidDateFromSelf,
  dateDeadline: Schema.ValidDateFromSelf,
  dateFinish: Schema.ValidDateFromSelf,
  dateStart: Schema.ValidDateFromSelf,
  id: IdEvent,
  idPlace: IdPlace,
  name: Schema.Redacted(Schema.String),
  priceDay: Schema.compose(BigDecimalFromPrismaDecimal, Price),
  priceEvent: Schema.compose(BigDecimalFromPrismaDecimal, Price),
  description: Schema.String,
}).pipe(
  Schema.extend(BaseDb),
  Schema.annotations({ identifier: "EventDb" }),
  _SS.satisfies.encoded<_Event>()
);

export const EventDbToDomain = transform(
  EventDb,
  Event,
  Effect.succeed,
  Effect.succeed
);
