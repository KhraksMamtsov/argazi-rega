import * as Schema from "@effect/schema/Schema";

import {
  IdEventSchema,
  IdPlaceSchema,
  PriceSchema,
  type EventBase,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _EventApi = Schema.Struct({
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
  description: Schema.String,
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<EventBase>(),
  Schema.identifier("EventApi")
);

export interface EventApiEncoded
  extends Schema.Schema.Encoded<typeof _EventApi> {}
export interface EventApi extends Schema.Schema.Type<typeof _EventApi> {}

export const EventApi: Schema.Schema<EventApi, EventApiEncoded> = _EventApi;
