import { Effect, Option } from "effect";

import { PrismaServiceTag, VisitorDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { CreateUsersVisitorCommand } from "./CreateUsersVisitor.command.js";

import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const CreateUsersVisitorUseCase = BaseCausedUseCaseFor(
  CreateUsersVisitorCommand
)(({ payload, initiator }) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;
    const notificationService = yield* NotificationServiceTag;

    const newVisitor = yield* prismaClient.queryDecode(VisitorDbToDomain, (p) =>
      p.visitor.create({
        data: {
          ...payload,
          email: payload.email.pipe(Option.getOrNull),
          idUserCreator: initiator.id,
          idUserUpdater: initiator.id,
        },
      })
    );

    Effect.runFork(
      notificationService.queue(
        notification.visitor("created")({
          idEntity: newVisitor.id,
          idInitiator: initiator.id,
        })
      )
    );

    return newVisitor;
  })
);
