import { RestApiSpec } from "@argazi/rest-api-spec";
import { HttpApiBuilder } from "@effect/platform";
import { CreateUserSubscriptionHandlerLive } from "./_subscriptions/CreateUserSubscription.handler.js";
import { DeleteUserSubscriptionHandlerLive } from "./_subscriptions/DeleteUserSubscription.handler.js";
import { GetUserSubscriptionsHandlerLive } from "./_subscriptions/GetUserSubscriptions.handler.js";
import { BookTicketHandlerLive } from "./_tickets/BookTicket.handler.js";
import { GetUserTicketByIdHandlerLive } from "./_tickets/GetUserTicketById.handler.js";
import { ReturnTicketHandlerLive } from "./_tickets/ReturnTicketOnEvent.handler.js";
import { CreateUsersVisitorHandlerLive } from "./_visitors/CreateUsersVisitor.handler.js";
import { GetUserHandlerLive } from "./get/GetUser.handler.js";
import { GetManyUsersHandlerLive } from "./get-many/GetManyUsers.handler.js";
import { CreateUserHandlerLive } from "./create/CreateUser.handler.js";
import { UpdateUserHandlerLive } from "./update/UpdateUser.handler.js";

export const UserGroupHandlerLive = HttpApiBuilder.group(
  RestApiSpec,
  "User",
  (handlers) =>
    handlers
      .handle("createUserSubscription", CreateUserSubscriptionHandlerLive)
      .handle("deleteUserSubscription", DeleteUserSubscriptionHandlerLive)
      .handle("getUserSubscriptions", GetUserSubscriptionsHandlerLive)
      .handle("bookTicket", BookTicketHandlerLive)
      .handle("getUserTicketById", GetUserTicketByIdHandlerLive)
      .handle("returnTicket", ReturnTicketHandlerLive)
      .handle("createUsersVisitor", CreateUsersVisitorHandlerLive)
      .handle("createUser", CreateUserHandlerLive)
      .handle("getUser", GetUserHandlerLive)
      .handle("getManyUsers", GetManyUsersHandlerLive)
      .handle("updateUser", UpdateUserHandlerLive)
);
