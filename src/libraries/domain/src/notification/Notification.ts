import { Schema } from "@effect/schema";

import { _TS, _SS } from "@argazi/shared";

import { IdEventSchema } from "../event/entity/IdEvent.js";
import { IdGeoPointSchema } from "../geo-point/entity/IdGeoPoint.js";
import { IdPlaceSchema } from "../place/entity/IdPlace.js";
import { IdSubscriptionSchema } from "../subscription/entity/IdSubscription.js";
import { IdTicketSchema } from "../ticket/entity/IdTicket.js";
import { IdTransportSchema } from "../transport/entity/IdTransport.js";
import { type IdUser, IdUserSchema } from "../user/entity/IdUser.js";
import { IdVisitorSchema } from "../visitor/IdVisitor.js";

export const NotificationIssueSchema = Schema.Literal(
  "updated",
  "created",
  "deleted"
);
export type NotificationIssue = Schema.Schema.Type<
  typeof NotificationIssueSchema
>;

const NotificationEntitySchema = Schema.Union(
  Schema.Struct({
    id: IdUserSchema,
    type: Schema.Literal("User"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdGeoPointSchema,
    type: Schema.Literal("GeoPoint"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdPlaceSchema,
    type: Schema.Literal("Place"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdTicketSchema,
    type: Schema.Literal("Ticket"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdTransportSchema,
    type: Schema.Literal("Transport"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdEventSchema,
    type: Schema.Literal("Event"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdSubscriptionSchema,
    type: Schema.Literal("Subscription"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdVisitorSchema,
    type: Schema.Literal("Visitor"),
  }).pipe(_SS.satisfies.encoded.json())
);
export type NotificationEntity = Schema.Schema.Type<
  typeof NotificationEntitySchema
>;

export const _NotificationSchema = Schema.parseJson(
  Schema.Struct({
    _tag: Schema.Literal("Notification"),
    entity: NotificationEntitySchema,
    idInitiator: IdUserSchema,
    issue: NotificationIssueSchema,
  }).pipe(_SS.satisfies.encoded.json())
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
  visitor: _notification("Visitor"),
};
