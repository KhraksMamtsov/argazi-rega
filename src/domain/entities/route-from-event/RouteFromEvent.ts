import { Schema } from "@effect/schema";
import { RouteFromEventIdSchema } from "./RouteFromEventId.js";
import { BaseSchema } from "../common/Base.js";
import { GeoPointIdSchema } from "../geo-point/GeoPointId.js";
import { TransportOnEventIdSchema } from "../transport-on-event/TransportOnEventId.js";

const _RouteFromEventSchema = Schema.struct({
  id: RouteFromEventIdSchema,
  idGeoPoint: GeoPointIdSchema,
  idTransportOnEvent: TransportOnEventIdSchema,
  //
  name: Schema.option(Schema.Trim.pipe(Schema.nonEmpty())),
  dateStart: Schema.option(Schema.Date),
  dateFinish: Schema.option(Schema.option(Schema.Date)),
}).pipe(Schema.extend(BaseSchema), Schema.identifier("RouteFromEventSchema"));

export interface RouteFromEventFrom
  extends Schema.Schema.From<typeof _RouteFromEventSchema> {}
export interface RouteFromEvent
  extends Schema.Schema.To<typeof _RouteFromEventSchema> {}

export const RouteFromEventSchema: Schema.Schema<
  RouteFromEventFrom,
  RouteFromEvent
> = _RouteFromEventSchema;
