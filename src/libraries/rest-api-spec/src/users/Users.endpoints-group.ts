import { flow } from "effect";
import { ApiGroup } from "effect-http";

import { CreateUserSubscriptionEndpoint } from "./_subscriptions/CreateUserSubscription.endpoint.js";
import { DeleteUserSubscriptionEndpoint } from "./_subscriptions/DeleteUserSubscription.endpoint.js";
import { GetUserSubscriptionsEndpoint } from "./_subscriptions/GetUserSubscriptions.endpoint.js";
import { BookTicketEndpoint } from "./_tickets/BookTicket.endpoint.js";
import { GetUserTicketByIdEndpoint } from "./_tickets/GetUserTicketById.endpoint.js";
import { ReturnTicketEndpoint } from "./_tickets/ReturnTicketOnEvent.endpoint.js";
import { CreateUsersVisitorEndpoint } from "./_visitors/CreateUsersVisitor.endpoint.js";
import { CreateUserEndpoint } from "./create/CreateUser.endpoint.js";
import { GetUserEndpoint } from "./get/GetUser.endpoint.js";
import { GetManyUsersEndpoint } from "./get-many/GetManyUsers.endpoint.js";
import { UpdateUserEndpoint } from "./update/UpdateUser.endpoint.js";

export const UsersEndpointsGroup = ApiGroup.make("User").pipe(
  ApiGroup.addEndpoint(CreateUserEndpoint),
  ApiGroup.addEndpoint(GetUserEndpoint),
  ApiGroup.addEndpoint(UpdateUserEndpoint),
  ApiGroup.addEndpoint(GetManyUsersEndpoint),
  // region Subscriptions
  flow(
    ApiGroup.addEndpoint(CreateUserSubscriptionEndpoint),
    ApiGroup.addEndpoint(GetUserSubscriptionsEndpoint),
    ApiGroup.addEndpoint(DeleteUserSubscriptionEndpoint)
  ),
  // endregion
  // region Tickets
  flow(
    //
    ApiGroup.addEndpoint(BookTicketEndpoint),
    ApiGroup.addEndpoint(GetUserTicketByIdEndpoint),
    ApiGroup.addEndpoint(ReturnTicketEndpoint)
  ),
  // endregion
  // region Visitors
  flow(
    //
    ApiGroup.addEndpoint(CreateUsersVisitorEndpoint)
  )
  // endregion
);
