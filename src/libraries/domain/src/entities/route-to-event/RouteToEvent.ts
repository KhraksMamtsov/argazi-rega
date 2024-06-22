import { Schema } from "@effect/schema";

import { IdRouteToEvent } from "./RouteToEventId.js";

import { IdGeoPoint } from "../../geo-point/entity/IdGeoPoint.js";
import { Base } from "../common/Base.js";
import { IdTransportOnEvent } from "../transport-on-event/IdTransportOnEvent.js";

const _RouteToEvent = Schema.Struct({
  dateFinish: Schema.Option(Schema.Date),
  dateStart: Schema.Option(Schema.Date),
  id: IdRouteToEvent,
  idGeoPoint: IdGeoPoint,
  idTransportOnEvent: IdTransportOnEvent,
  //
  name: Schema.Option(Schema.Trim.pipe(Schema.nonEmpty())),
}).pipe(
  Schema.extend(Base),
  Schema.annotations({ identifier: "RouteToEvent" })
);

export type RouteToEventFrom = Schema.Schema.Encoded<typeof _RouteToEvent>;
export type RouteToEvent = Schema.Schema.Type<typeof _RouteToEvent>;

export const RouteToEvent: Schema.Schema<RouteToEvent, RouteToEventFrom> =
  _RouteToEvent;
