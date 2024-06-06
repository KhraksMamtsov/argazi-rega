import { Schema } from "@effect/schema";

import { IdEvent } from "./IdEvent.js";

import { Base } from "../../entities/common/Base.js";
import { IdPlace } from "../../place/entity/IdPlace.js";
import { Price } from "../../value-objects/Price.js";

export const EventBase = Schema.Struct({
  dateAnnouncement: Schema.ValidDateFromSelf,
  dateDeadline: Schema.ValidDateFromSelf,
  dateFinish: Schema.ValidDateFromSelf,
  dateStart: Schema.ValidDateFromSelf,
  id: IdEvent,
  idPlace: IdPlace,
  name: Schema.RedactedFromSelf(Schema.String),
  priceDay: Price,
  priceEvent: Price,
  description: Schema.String,
}).pipe(Schema.identifier("EventBase"));

export type EventBase = Schema.Schema.Type<typeof EventBase>;

const _Event = EventBase.pipe(
  //
  Schema.extend(Base),
  Schema.identifier("Event")
);

export interface Event extends Schema.Schema.Type<typeof _Event> {}

export const Event: Schema.Schema<Event> = Schema.typeSchema(_Event);
