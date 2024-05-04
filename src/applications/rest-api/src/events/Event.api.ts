import * as Schema from "@effect/schema/Schema";

import { IdEvent, IdPlace, Price, type EventBase } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _EventApi = Schema.Struct({
  dateAnnouncement: Schema.compose(
    Schema.DateFromString,
    Schema.ValidDateFromSelf
  ),
  dateDeadline: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  dateFinish: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  dateStart: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  id: IdEvent,
  idPlace: IdPlace,
  name: Schema.Secret,
  priceDay: Schema.compose(Schema.BigDecimalFromNumber, Price),
  priceEvent: Schema.compose(Schema.BigDecimalFromNumber, Price),
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
