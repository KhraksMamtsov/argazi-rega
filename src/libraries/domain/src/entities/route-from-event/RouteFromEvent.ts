import { Schema } from "@effect/schema";

import { RouteFromEventIdSchema } from "./RouteFromEventId.js";

import { IdGeoPointSchema } from "../../geo-point/entity/IdGeoPoint.js";
import { BaseSchema } from "../common/Base.js";
import { IdTransportOnEventSchema } from "../transport-on-event/IdTransportOnEvent.js";

const _RouteFromEventSchema = Schema.Struct({
  dateFinish: Schema.Option(Schema.Date),
  dateStart: Schema.Option(Schema.Date),
  id: RouteFromEventIdSchema,
  idGeoPoint: IdGeoPointSchema,
  idTransportOnEvent: IdTransportOnEventSchema,
  //
  name: Schema.Option(Schema.Trim.pipe(Schema.nonEmpty())),
}).pipe(Schema.extend(BaseSchema), Schema.identifier("RouteFromEventSchema"));

export type RouteFromEventFrom = Schema.Schema.Encoded<
  typeof _RouteFromEventSchema
>;
export type RouteFromEvent = Schema.Schema.Type<typeof _RouteFromEventSchema>;

export const RouteFromEventSchema: Schema.Schema<
  RouteFromEvent,
  RouteFromEventFrom
> = _RouteFromEventSchema;
