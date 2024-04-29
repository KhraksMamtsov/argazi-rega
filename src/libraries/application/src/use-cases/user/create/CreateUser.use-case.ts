import { Effect } from "effect";

import { PrismaServiceTag, UserDbToDomainSchema } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { CreateUserCommandSchema } from "./CreateUser.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const CreateUserUseCase = BaseCausedUseCaseFor(CreateUserCommandSchema)(
  ({ payload, initiator }) =>
    Effect.gen(function* (_) {
      const prismaClient = yield* PrismaServiceTag;
      const notificationService = yield* NotificationServiceTag;

      const newUser = yield* prismaClient.queryDecode(
        UserDbToDomainSchema,
        (p) =>
          p.user.create({
            data: {
              ...payload,
              idUserCreator: initiator.id,
              idUserUpdater: initiator.id,
              isAdmin: false,
            },
          })
      );

      Effect.runFork(
        notificationService.queue(
          notification.user("created")({
            idEntity: newUser.id,
            idInitiator: initiator.id,
          })
        )
      );

      return newUser;
    })
);
