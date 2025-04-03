import { BearerAuthentication } from "../_security/BearerAuth.security.js";
import { CreateMySubscriptionEndpoint } from "./_subscriptions/CreateMySubscription.endpoint.js";
import { DeleteMySubscriptionEndpoint } from "./_subscriptions/DeleteMySubscription.endpoint.js";
import { GetMySubscriptionsEndpoint } from "./_subscriptions/GetMySubscriptions.endpoint.js";
import { BookMyTicketEndpoint } from "./_tickets/BookMyTicket.endpoint.js";
import { GetMyTicketByIdEndpoint } from "./_tickets/GetMyTicketById.endpoint.js";
import { GetMyTicketsEndpoint } from "./_tickets/GetMyTickets.endpoint.js";
import { ReturnMyTicketEndpoint } from "./_tickets/ReturnMyTicket.endpoint.js";
import { CreateMyVisitorEndpoint } from "./_visitors/CreateMyVisitor.endpoint.js";
import { DeleteMyVisitorEndpoint } from "./_visitors/DeleteMyVisitor.endpoint.js";
import { GetMyVisitorsEndpoint } from "./_visitors/GetMyVisitors.endpoint.js";
import { GetMyIdentityEndpoint } from "./GetMyIdentity.endpoint.js";
import { HttpApiGroup } from "@effect/platform";

export const MyEndpointsGroup = HttpApiGroup.make("My")
  .add(GetMyIdentityEndpoint)
  // #region Subscriptions
  .add(CreateMySubscriptionEndpoint)
  .add(GetMySubscriptionsEndpoint)
  .add(DeleteMySubscriptionEndpoint)
  // #endregion
  // #region Tickets
  .add(BookMyTicketEndpoint)
  .add(GetMyTicketByIdEndpoint)
  .add(ReturnMyTicketEndpoint)
  .add(GetMyTicketsEndpoint)
  // #endregion
  // #region Visitors
  .add(CreateMyVisitorEndpoint)
  .add(GetMyVisitorsEndpoint)
  .add(DeleteMyVisitorEndpoint)
  .middleware(BearerAuthentication);
// #endregion
