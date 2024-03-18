import { flow } from "effect";
import { Api } from "effect-http";

import { CreateMySubscriptionEndpoint } from "./_subscriptions/CreateMySubscription.endpoint.js";
import { DeleteMySubscriptionEndpoint } from "./_subscriptions/DeleteMySubscription.endpoint.js";
import { GetMySubscriptionsEndpoint } from "./_subscriptions/GetMySubscriptions.endpoint.js";
import { BookMyTicketEndpoint } from "./_tickets/BookMyTicket.endpoint.js";
import { GetMyTicketByIdEndpoint } from "./_tickets/GetMyTicketById.endpoint.js";
import { GetMyTicketsEndpoint } from "./_tickets/GetMyTickets.endpoint.js";
import { ReturnMyTicketEndpoint } from "./_tickets/ReturnTicketOnEvent.endpoint.js";
import { GetMyIdentityEndpoint } from "./Identity.endpoint.js";

export const MyEndpointsGroup = ApiGroup.make("my").pipe(
	GetMyIdentityEndpoint,
	// region Subscriptions
	flow(
		CreateMySubscriptionEndpoint,
		GetMySubscriptionsEndpoint,
		DeleteMySubscriptionEndpoint
	),
	// endregion
	// region Tickets
	flow(
		BookMyTicketEndpoint,
		GetMyTicketByIdEndpoint,
		ReturnMyTicketEndpoint,
		GetMyTicketsEndpoint
	)
	// endregion
);
