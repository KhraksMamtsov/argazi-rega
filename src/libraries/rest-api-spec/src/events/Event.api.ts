import { Schema } from "effect";

import { IdEvent, IdPlace, Price, type EventBase } from "@argazi/domain";
import type { Json } from "@argazi/shared/Schema";

export class EventApi extends Schema.Class<EventApi>("EventApi")({
  dateAnnouncement: Schema.compose(
    Schema.DateFromString,
    Schema.ValidDateFromSelf
  ),
  dateDeadline: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  dateFinish: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  dateStart: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  id: IdEvent,
  idPlace: IdPlace,
  name: Schema.Redacted(Schema.String),
  priceDay: Schema.compose(Schema.BigDecimalFromNumber, Price),
  priceEvent: Schema.compose(Schema.BigDecimalFromNumber, Price),
  description: Schema.String,
}) {}

EventApi.Type satisfies EventBase;
EventApi.Encoded satisfies Json.Json;
