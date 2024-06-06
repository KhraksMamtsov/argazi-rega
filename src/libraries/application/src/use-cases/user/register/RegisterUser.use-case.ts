import { Effect, Option, Redacted } from "effect";

import { PrismaServiceTag, UserDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { RegisterUserCommand } from "./RegisterUser.command.js";

import { BaseUseCaseFor } from "../../common/Base.use-case.js";

export const RegisterUserUseCase = BaseUseCaseFor(RegisterUserCommand)(
  ({ payload }) =>
    Effect.gen(function* (_) {
      const prismaClient = yield* PrismaServiceTag;
      const notificationService = yield* NotificationServiceTag;

      const newUser = yield* prismaClient.queryDecode(UserDbToDomain, (p) =>
        p.user.create({
          data: {
            ...payload,
            email: Redacted.value(payload.email),
            firstName: Redacted.value(payload.firstName),
            idUserCreator: payload.id,
            idUserUpdater: payload.id,
            lastName: Option.map(payload.lastName, Redacted.value).pipe(
              Option.getOrNull
            ),
            phone: Option.map(payload.phone, Redacted.value).pipe(
              Option.getOrNull
            ),
          },
        })
      );

      if (!newUser.isAdmin) {
        Effect.runFork(
          notificationService.queue(
            notification.user("created")({
              idEntity: newUser.id,
              idInitiator: newUser.id,
            })
          )
        );
      }

      return newUser;
    })
);
