import { Schema } from "@effect/schema";

import { _TS, _SS } from "@argazi/shared";

import { IdEvent } from "../event/entity/IdEvent.js";
import { IdGeoPoint } from "../geo-point/entity/IdGeoPoint.js";
import { IdPlace } from "../place/entity/IdPlace.js";
import { IdSubscription } from "../subscription/entity/IdSubscription.js";
import { IdTicket } from "../ticket/entity/IdTicket.js";
import { IdTransport } from "../transport/entity/IdTransport.js";
import { IdUser } from "../user/entity/IdUser.js";
import { IdVisitor } from "../visitor/IdVisitor.js";

export const NotificationIssue = Schema.Literal(
  "updated",
  "created",
  "deleted"
);
export type NotificationIssue = Schema.Schema.Type<typeof NotificationIssue>;

const NotificationEntity = Schema.Union(
  Schema.Struct({
    id: IdUser,
    type: Schema.Literal("User"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdGeoPoint,
    type: Schema.Literal("GeoPoint"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdPlace,
    type: Schema.Literal("Place"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdTicket,
    type: Schema.Literal("Ticket"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdTransport,
    type: Schema.Literal("Transport"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdEvent,
    type: Schema.Literal("Event"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdSubscription,
    type: Schema.Literal("Subscription"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    id: IdVisitor,
    type: Schema.Literal("Visitor"),
  }).pipe(_SS.satisfies.encoded.json())
);
export type NotificationEntity = Schema.Schema.Type<typeof NotificationEntity>;

export const _Notification = Schema.parseJson(
  Schema.Struct({
    _tag: Schema.Literal("Notification"),
    entity: NotificationEntity,
    idInitiator: IdUser,
    issue: NotificationIssue,
  }).pipe(_SS.satisfies.encoded.json())
).pipe(Schema.identifier("Notification"));

export type NotificationFrom = Schema.Schema.Encoded<typeof _Notification>;
export interface Notification
  extends Schema.Schema.Type<typeof _Notification> {}

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

export const Notification: Schema.Schema<Notification, NotificationFrom> =
  _Notification;

export const encodeNotification = Schema.encode(Notification);
export const decodeEitherNotification = Schema.decodeEither(Notification);

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
