import { Schema } from "@effect/schema";

import { RouteToEventIdSchema } from "./RouteToEventId.js";

import { IdGeoPointSchema } from "../../geo-point/entity/IdGeoPoint.js";
import { BaseSchema } from "../common/Base.js";
import { IdTransportOnEventSchema } from "../transport-on-event/IdTransportOnEvent.js";

const _RouteToEventSchema = Schema.struct({
	dateFinish: Schema.option(Schema.option(Schema.Date)),
	dateStart: Schema.option(Schema.Date),
	id: RouteToEventIdSchema,
	idGeoPoint: IdGeoPointSchema,
	idTransportOnEvent: IdTransportOnEventSchema,
	//
	name: Schema.option(Schema.Trim.pipe(Schema.nonEmpty())),
}).pipe(Schema.extend(BaseSchema), Schema.identifier("RouteToEventSchema"));

export type RouteToEventFrom = Schema.Schema.Encoded<
	typeof _RouteToEventSchema
>;
export type RouteToEvent = Schema.Schema.Type<typeof _RouteToEventSchema>;

export const RouteToEventSchema: Schema.Schema<RouteToEvent, RouteToEventFrom> =
	_RouteToEventSchema;
