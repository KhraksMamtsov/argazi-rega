import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { GetMyVisitorsHandlerLive } from "./_visitors/GetMyVisitors.handler.js";
import { GetMyIdentityHandlerLive } from "./GetMyIdentity.handler.js";
import { BookMyTicketHandlerLive } from "./_tickets/BookMyTicket.handler.js";
import { GetMyTicketByIdHandlerLive } from "./_tickets/GetMyTicketById.handler.js";
import { GetMyTicketsHandlerLive } from "./_tickets/GetMyTickets.handler.js";
import { ReturnMyTicketHandlerLive } from "./_tickets/ReturnMyTicket.handler.js";
import { DeleteMyVisitorHandlerLive } from "./_visitors/DeleteMyVisitor.handler.js";
import { CreateMyVisitorHandlerLive } from "./_visitors/CreateMyVisitor.handler.js";
import { GetMySubscriptionsHandlerLive } from "./_subscriptions/GetMySubscriptions.handler.js";
import { DeleteMySubscriptionHandlerLive } from "./_subscriptions/DeleteMySubscription.handler.js";
import { CreateMySubscriptionHandlerLive } from "./_subscriptions/CreateMySubscription.handler.js";

export const MyGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "My",
  (handlers) =>
    handlers
      .handle("getMyIdentity", GetMyIdentityHandlerLive)
      // Visitor
      .handle("getMyVisitors", GetMyVisitorsHandlerLive)
      .handle("deleteMyVisitor", DeleteMyVisitorHandlerLive)
      .handle("createMyVisitor", CreateMyVisitorHandlerLive)
      // Ticket
      .handle("bookMyTicket", BookMyTicketHandlerLive)
      .handle("getMyTicketById", GetMyTicketByIdHandlerLive)
      .handle("getMyTickets", GetMyTicketsHandlerLive)
      .handle("returnMyTicket", ReturnMyTicketHandlerLive)
      // Subscription
      .handle("createMySubscription", CreateMySubscriptionHandlerLive)
      .handle("deleteMySubscription", DeleteMySubscriptionHandlerLive)
      .handle("getMySubscriptions", GetMySubscriptionsHandlerLive)
);
