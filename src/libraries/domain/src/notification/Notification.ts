import { _TS, _SS } from "@argazi/shared";
import { Schema } from "@effect/schema";

import { IdEventSchema } from "../event/entity/IdEvent.js";
import { IdGeoPointSchema } from "../geo-point/entity/IdGeoPoint.js";
import { IdPlaceSchema } from "../place/entity/IdPlace.js";
import { IdSubscriptionSchema } from "../subscription/entity/IdSubscription.js";
import { IdTicketSchema } from "../ticket/entity/IdTicket.js";
import { IdTransportSchema } from "../transport/entity/IdTransport.js";
import { type IdUser, IdUserSchema } from "../user/entity/IdUser.js";

export const NotificationIssueSchema = Schema.literal(
	"updated",
	"created",
	"deleted"
);
export type NotificationIssue = Schema.Schema.Type<
	typeof NotificationIssueSchema
>;

const NotificationEntitySchema = Schema.union(
	Schema.struct({
		id: IdUserSchema,
		type: Schema.literal("User"),
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		id: IdGeoPointSchema,
		type: Schema.literal("GeoPoint"),
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		id: IdPlaceSchema,
		type: Schema.literal("Place"),
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		id: IdTicketSchema,
		type: Schema.literal("Ticket"),
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		id: IdTransportSchema,
		type: Schema.literal("Transport"),
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		id: IdEventSchema,
		type: Schema.literal("Event"),
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		id: IdSubscriptionSchema,
		type: Schema.literal("Subscription"),
	}).pipe(_SS.satisfies.from.json())
);
export type NotificationEntity = Schema.Schema.Type<
	typeof NotificationEntitySchema
>;

export const _NotificationSchema = Schema.parseJson(
	Schema.struct({
		_tag: Schema.literal("Notification"),
		entity: NotificationEntitySchema,
		idInitiator: IdUserSchema,
		issue: NotificationIssueSchema,
	}).pipe(_SS.satisfies.from.json())
).pipe(Schema.identifier("NotificationSchema"));

export type NotificationFrom = Schema.Schema.Encoded<
	typeof _NotificationSchema
>;
export interface Notification
	extends Schema.Schema.Type<typeof _NotificationSchema> {}

export type NotificationWithIssue<
	I extends NotificationIssue,
	N extends Notification = Notification,
> = _TS.Simplify<N & { readonly issue: I }>;

export type NotificationWithEntity<
	E extends NotificationEntity["type"],
	N extends Notification = Notification,
> = _TS.Simplify<
	N & {
		readonly entity: _TS.Simplify<NotificationEntity & { readonly type: E }>;
	}
>;

export const NotificationSchema: Schema.Schema<Notification, NotificationFrom> =
	_NotificationSchema;

export const encodeNotification = Schema.encode(NotificationSchema);
export const decodeEitherNotification = Schema.decodeEither(NotificationSchema);

const _notification =
	<Type extends NotificationEntity["type"]>(type: Type) =>
	<Issue extends NotificationIssue>(issue: Issue) =>
	(args: {
		readonly idEntity: Extract<
			NotificationEntity,
			{ readonly type: Type }
		>["id"];
		readonly idInitiator: IdUser;
	}): Notification =>
		({
			_tag: "Notification" as const,
			entity: {
				id: args.idEntity,
				type,
			},
			idInitiator: args.idInitiator,

			issue,
		}) as Notification;

export const notification = {
	event: _notification("Event"),
	geoPoint: _notification("GeoPoint"),
	place: _notification("Place"),
	subscription: _notification("Subscription"),
	ticket: _notification("Ticket"),
	transport: _notification("Transport"),
	user: _notification("User"),
};
