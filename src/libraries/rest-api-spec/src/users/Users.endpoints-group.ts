import { HttpApiGroup } from "@effect/platform";

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
import { BearerAuthentication } from "../_security/BearerAuth.security.js";

export const UsersEndpointsGroup = HttpApiGroup.make("User")
  .add(CreateUserEndpoint)
  .add(GetUserEndpoint)
  .add(UpdateUserEndpoint)
  .add(GetManyUsersEndpoint)
  // region Subscriptions
  .add(CreateUserSubscriptionEndpoint)
  .add(GetUserSubscriptionsEndpoint)
  .add(DeleteUserSubscriptionEndpoint)
  // endregion
  // region Tickets
  .add(BookTicketEndpoint)
  .add(GetUserTicketByIdEndpoint)
  .add(ReturnTicketEndpoint)
  // endregion
  // region Visitors
  .add(CreateUsersVisitorEndpoint)
  .middleware(BearerAuthentication);
// endregion
