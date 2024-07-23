import { Schema } from "@effect/schema";

import { IdRouteFromEvent } from "./RouteFromEventId.js";

import { IdGeoPoint } from "../../geo-point/entity/IdGeoPoint.js";
import { Base } from "../common/Base.js";
import { IdTransportOnEvent } from "../transport-on-event/IdTransportOnEvent.js";

const _RouteFromEvent = Schema.Struct({
  dateFinish: Schema.Option(Schema.Date),
  dateStart: Schema.Option(Schema.Date),
  id: IdRouteFromEvent,
  idGeoPoint: IdGeoPoint,
  idTransportOnEvent: IdTransportOnEvent,
  //
  name: Schema.Option(Schema.Trim.pipe(Schema.nonEmptyString())),
}).pipe(
  Schema.extend(Base),
  Schema.annotations({ identifier: "RouteFromEvent" })
);

export interface RouteFromEventFrom
  extends Schema.Schema.Encoded<typeof _RouteFromEvent> {}
export interface RouteFromEvent
  extends Schema.Schema.Type<typeof _RouteFromEvent> {}

export const RouteFromEvent: Schema.Schema<RouteFromEvent, RouteFromEventFrom> =
  _RouteFromEvent;
