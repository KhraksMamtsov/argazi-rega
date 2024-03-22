import { flow } from "effect";
import { ApiGroup } from "effect-http";

import { CreateMySubscriptionEndpoint } from "./_subscriptions/CreateMySubscription.endpoint.js";
import { DeleteMySubscriptionEndpoint } from "./_subscriptions/DeleteMySubscription.endpoint.js";
import { GetMySubscriptionsEndpoint } from "./_subscriptions/GetMySubscriptions.endpoint.js";
import { BookMyTicketEndpoint } from "./_tickets/BookMyTicket.endpoint.js";
import { GetMyTicketByIdEndpoint } from "./_tickets/GetMyTicketById.endpoint.js";
import { GetMyTicketsEndpoint } from "./_tickets/GetMyTickets.endpoint.js";
import { ReturnMyTicketEndpoint } from "./_tickets/ReturnTicketOnEvent.endpoint.js";
import { GetMyIdentityEndpoint } from "./Identity.endpoint.js";

export const MyEndpointsGroup = ApiGroup.make("my").pipe(
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
	)
	// #endregion
);