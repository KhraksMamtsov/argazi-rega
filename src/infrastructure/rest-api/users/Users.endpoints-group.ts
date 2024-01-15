import { flow } from "effect";
import { Api } from "effect-http";

import { CreateUserSubscriptionEndpoint } from "./_subscriptions/CreateUserSubscription.endpoint.js";
import { DeleteUserSubscriptionEndpoint } from "./_subscriptions/DeleteUserSubscription.endpoint.js";
import { GetUserSubscriptionsEndpoint } from "./_subscriptions/GetUserSubscriptions.endpoint.js";
import { BookTicketEndpoint } from "./_tickets/BookTicketOnEvent.endpoint.js";
import { GetUserTicketByIdEndpoint } from "./_tickets/GetUserTicketById.endpoint.js";
import { ReturnTicketEndpoint } from "./_tickets/ReturnTicketOnEvent.endpoint.js";
import * as CreateUsersEndpoint from "./create/CreateUser.endpoint.js";
import * as GetUserEndpoint from "./get/GetUser.endpoint.js";
import * as GetManyUsersEndpoint from "./get-many/GetManyUsers.endpoint.js";
import * as UpdateUsersEndpoint from "./update/UpdateUser.endpoint.js";

import { BearerAuth } from "../BearerAuth.security-scheme.js";

export const UsersEndpointsGroup = Api.apiGroup("user").pipe(
	Api.post(
		"createUser",
		"/users",
		{
			request: CreateUsersEndpoint.CreateUserRequest,
			response: {
				content: CreateUsersEndpoint.CreateUserResponseSchema,
				status: 201 as const,
			},
		},
		{
			security: BearerAuth,
		}
	),
	Api.patch(
		"updateUser",
		"/users/:id",
		{
			request: UpdateUsersEndpoint.UpdateUserRequest,
			response: [
				{
					content: UpdateUsersEndpoint.UpdateUserResponseSchema,
					status: 200 as const,
				},
			],
		},
		{
			security: BearerAuth,
		}
	),
	Api.get(
		"getUser",
		"/users/:idUser",
		{
			request: GetUserEndpoint.GetUserRequest,
			response: GetUserEndpoint.GetUserResponse,
		}
		// {
		//   security: BearerAuth,
		// },
	),
	Api.post(
		"getManyUsers",
		"/users/many",
		{
			request: GetManyUsersEndpoint.GetManyUsersRequest,
			response: GetManyUsersEndpoint.GetManyUsersResponse,
		}
		// {
		//   security: BearerAuth,
		// },
	),
	// region Subscriptions
	flow(
		CreateUserSubscriptionEndpoint,
		GetUserSubscriptionsEndpoint,
		DeleteUserSubscriptionEndpoint
	),
	// endregion
	// region Tickets
	flow(
		//
		BookTicketEndpoint,
		GetUserTicketByIdEndpoint,
		ReturnTicketEndpoint
	)
	// endregion
);
