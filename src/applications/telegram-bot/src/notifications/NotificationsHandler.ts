import { Effect } from "effect";

import { type NotificationMessage } from "@argazi/domain";
import { IdAdmin } from "@argazi/rest-api";

import { EventCreatedNotificationHandler } from "./event/EventCreated.notification-handler.js";
import { SubscriptionCancelledNotificationHandler } from "./subscription/SubscriptionCancelled.notification-handler.js";
import { SubscriptionCreatedNotificationHandler } from "./subscription/SubscriptionCreated.notification-handler.js";
import { TicketCreatedNotificationHandler } from "./ticket/TicketCreated.notification-handler.js";
import { TicketReturnedNotificationHandler } from "./ticket/TicketReturned.notification-handler.js";
import { UserCreatedNotificationHandler } from "./user/UserCreated.notification-handler.js";
import { VisitorCreatedNotificationHandler } from "./visitor/VisitorCreated.notification-handler.js";
import { VisitorDeletedNotificationHandler } from "./visitor/VisitorDeleted.notification-handler.js";

import { RestApiServiceTag } from "../RestApiService.js";

export const NotificationsHandler = (args: {
  readonly notificationMessage: NotificationMessage;
}) =>
  Effect.gen(function* (_) {
    const restApiClient = yield* RestApiServiceTag;
    const { notification } = args.notificationMessage;

    yield* Effect.logDebug(args.notificationMessage);

    const initiator = yield* restApiClient.getUser({
      path: { idUser: notification.idInitiator },
    });

    const { entity } = notification;

    if (entity.type === "User") {
      const affectedUser = yield* restApiClient.getUser({
        path: { idUser: entity.id },
      });

      if (notification.issue === "created") {
        yield* UserCreatedNotificationHandler({
          createdUser: affectedUser,
          initiator,
        });

        yield* args.notificationMessage.ack();
      }
    }

    if (entity.type === "Event") {
      const affectedEvent = yield* restApiClient.getEvent({
        path: { idEvent: entity.id },
      });

      if (notification.issue === "created") {
        return yield* EventCreatedNotificationHandler({
          createdEvent: affectedEvent,
          initiator: initiator,
        });
      }
    }

    if (entity.type === "Ticket") {
      const affectedTicket = yield* restApiClient.getUserTicketById({
        path: { idTicket: entity.id, idUser: IdAdmin },
      });

      const user = yield* restApiClient.getUser({
        path: {
          idUser: affectedTicket.idUser,
        },
      });

      if (notification.issue === "created") {
        yield* TicketCreatedNotificationHandler({
          createdTicket: affectedTicket,
          initiator,
          user,
        });

        return Effect.void;
      }

      if (notification.issue === "deleted") {
        yield* TicketReturnedNotificationHandler({
          createdTicket: affectedTicket,
          initiator,
          user,
        });

        return Effect.void;
      }
    }

    if (entity.type === "Subscription") {
      const affectedSubscription = yield* restApiClient.getSubscription({
        path: { idSubscription: entity.id },
      });

      const user = yield* restApiClient.getUser({
        path: {
          idUser: affectedSubscription.idUser,
        },
      });

      if (notification.issue === "created") {
        yield* SubscriptionCreatedNotificationHandler({
          createdSubscription: affectedSubscription,
          initiator,
          user,
        });
      }

      if (notification.issue === "deleted") {
        yield* SubscriptionCancelledNotificationHandler({
          cancelledSubscription: affectedSubscription,
          initiator,
          user,
        });
      }
    }

    if (entity.type === "Visitor") {
      const affectedVisitor = yield* restApiClient.getVisitor({
        path: { idVisitor: entity.id },
      });

      const visitorsUser = yield* restApiClient.getUser({
        path: { idUser: affectedVisitor.idUser },
      });

      if (notification.issue === "created") {
        yield* VisitorCreatedNotificationHandler({
          createdVisitor: affectedVisitor,
          initiator,
          visitorsUser,
        });
      }

      if (notification.issue === "deleted") {
        yield* VisitorDeletedNotificationHandler({
          deletedVisitor: affectedVisitor,
          initiator,
          visitorsUser,
        });
      }
    }

    return yield* args.notificationMessage.ack();
  });
