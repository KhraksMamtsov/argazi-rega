import { Schema } from "@effect/schema";
import { RouteOnEventIdSchema } from "./RouteOnEventId.js";
import { BaseSchema } from "../common/Base.js";
import { GeoPointIdSchema } from "../geo-point/GeoPointId.js";
import { TransportOnEventIdSchema } from "../transport-on-event/TransportOnEventId.js";

const _RouteOnEventSchema = Schema.struct({
  id: RouteOnEventIdSchema,
  idGeoPoint: GeoPointIdSchema,
  idTransportOnEvent: TransportOnEventIdSchema,
  //
  name: Schema.option(Schema.Trim.pipe(Schema.nonEmpty())),
  dateStart: Schema.option(Schema.Date),
  dateFinish: Schema.option(Schema.option(Schema.Date)),
}).pipe(Schema.extend(BaseSchema), Schema.identifier("RouteOnEventSchema"));

export interface RouteOnEventFrom
  extends Schema.Schema.From<typeof _RouteOnEventSchema> {}
export interface RouteOnEvent
  extends Schema.Schema.To<typeof _RouteOnEventSchema> {}

export const RouteOnEventSchema: Schema.Schema<RouteOnEventFrom, RouteOnEvent> =
  _RouteOnEventSchema;
