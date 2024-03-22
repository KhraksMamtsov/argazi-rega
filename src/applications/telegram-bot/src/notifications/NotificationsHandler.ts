import { Effect } from "effect";

import { type NotificationMessage } from "@argazi/domain";
import { IdAdmin } from "@argazi/rest-api";

import { EventCreatedNotificationHandler } from "./event/EventCreated.notification-handler.js";
import { SubscriptionCancelledNotificationHandler } from "./subscription/SubscriptionCancelled.notification-handler.js";
import { SubscriptionCreatedNotificationHandler } from "./subscription/SubscriptionCreated.notification-handler.js";
import { TicketCreatedNotificationHandler } from "./ticket/TicketCreated.notification-handler.js";
import { TicketReturnedNotificationHandler } from "./ticket/TicketReturned.notification-handler.js";
import { UserCreatedNotificationHandler } from "./user/UserCreated.notification-handler.js";

import { RestApiServiceTag } from "../RestApiService.js";

export const NotificationsHandler = (args: {
  readonly notificationMessage: NotificationMessage;
}) =>
  Effect.gen(function* (_) {
    const restApiClient = yield* _(RestApiServiceTag);
    const { notification } = args.notificationMessage;

    yield* _(Effect.logDebug(args.notificationMessage));

    const initiator = yield* _(
      restApiClient.getUser({ path: { idUser: notification.idInitiator } })
    );

    const { entity } = notification;

    if (entity.type === "User") {
      const affectedUser = yield* _(
        restApiClient.getUser({ path: { idUser: entity.id } })
      );

      if (notification.issue === "created") {
        yield* _(
          UserCreatedNotificationHandler({
            createdUser: affectedUser,
            initiator,
          })
        );

        yield* _(args.notificationMessage.ack());
      }
    }

    if (entity.type === "Event") {
      const affectedEvent = yield* _(
        restApiClient.getEvent({ path: { idEvent: entity.id } })
      );

      if (notification.issue === "created") {
        return yield* _(
          EventCreatedNotificationHandler({
            createdEvent: affectedEvent,
            initiator: initiator,
          })
        );
      }
    }

    if (entity.type === "Ticket") {
      const affectedTicket = yield* _(
        restApiClient.getUserTicketById({
          path: { idTicket: entity.id, idUser: IdAdmin },
        })
      );

      const user = yield* _(
        restApiClient.getUser({
          path: {
            idUser: affectedTicket.idUser,
          },
        })
      );

      if (notification.issue === "created") {
        yield* _(
          TicketCreatedNotificationHandler({
            createdTicket: affectedTicket,
            initiator,
            user,
          })
        );

        return Effect.unit;
      }

      if (notification.issue === "deleted") {
        yield* _(
          TicketReturnedNotificationHandler({
            createdTicket: affectedTicket,
            initiator,
            user,
          })
        );

        return Effect.unit;
      }
    }

    if (entity.type === "Subscription") {
      const affectedSubscription = yield* _(
        restApiClient.getSubscription({
          path: { idSubscription: entity.id },
        })
      );

      const user = yield* _(
        restApiClient.getUser({
          path: {
            idUser: affectedSubscription.idUser,
          },
        })
      );

      if (notification.issue === "created") {
        yield* _(
          SubscriptionCreatedNotificationHandler({
            createdSubscription: affectedSubscription,
            initiator,
            user,
          })
        );
      }

      if (notification.issue === "deleted") {
        yield* _(
          SubscriptionCancelledNotificationHandler({
            cancelledSubscription: affectedSubscription,
            initiator,
            user,
          })
        );
      }
    }

    return yield* _(args.notificationMessage.ack());
  });
