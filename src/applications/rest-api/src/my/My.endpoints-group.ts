import { flow } from "effect";
import { ApiGroup } from "effect-http";

import { CreateMySubscriptionEndpoint } from "./_subscriptions/CreateMySubscription.endpoint.js";
import { DeleteMySubscriptionEndpoint } from "./_subscriptions/DeleteMySubscription.endpoint.js";
import { GetMySubscriptionsEndpoint } from "./_subscriptions/GetMySubscriptions.endpoint.js";
import { BookMyTicketEndpoint } from "./_tickets/BookMyTicket.endpoint.js";
import { GetMyTicketByIdEndpoint } from "./_tickets/GetMyTicketById.endpoint.js";
import { GetMyTicketsEndpoint } from "./_tickets/GetMyTickets.endpoint.js";
import { ReturnMyTicketEndpoint } from "./_tickets/ReturnTicketOnEvent.endpoint.js";
import { CreateMyVisitorEndpoint } from "./_visitors/CreateMyVisitor.endpoint.js";
import { DeleteMyVisitorEndpoint } from "./_visitors/DeleteMyVisitor.endpoint.js";
import { GetMyVisitorsEndpoint } from "./_visitors/GetMyVisitors.endpoint.js";
import { GetMyIdentityEndpoint } from "./Identity.endpoint.js";

export const MyEndpointsGroup = ApiGroup.make("My").pipe(
  ApiGroup.addEndpoint(GetMyIdentityEndpoint),
  // #region Subscriptions
  flow(
    ApiGroup.addEndpoint(CreateMySubscriptionEndpoint),
    ApiGroup.addEndpoint(GetMySubscriptionsEndpoint),
    ApiGroup.addEndpoint(DeleteMySubscriptionEndpoint)
  ),
  // #endregion
  // #region Tickets
  flow(
    ApiGroup.addEndpoint(BookMyTicketEndpoint),
    ApiGroup.addEndpoint(GetMyTicketByIdEndpoint),
    ApiGroup.addEndpoint(ReturnMyTicketEndpoint),
    ApiGroup.addEndpoint(GetMyTicketsEndpoint)
  ),
  // #endregion
  // #region Visitors
  flow(
    ApiGroup.addEndpoint(CreateMyVisitorEndpoint),
    ApiGroup.addEndpoint(GetMyVisitorsEndpoint),
    ApiGroup.addEndpoint(DeleteMyVisitorEndpoint)
  )
  // #endregion
);
