import { Effect, Option } from "effect";

import { PrismaServiceTag, VisitorDbToDomainSchema } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { CreateUsersVisitorCommandSchema } from "./CreateUsersVisitor.command.js";

import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const CreateUsersVisitorUseCase = BaseCausedUseCaseFor(
  CreateUsersVisitorCommandSchema
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* _(PrismaServiceTag);
    const notificationService = yield* _(NotificationServiceTag);

    const newVisitor = yield* _(
      prismaClient.queryDecode(VisitorDbToDomainSchema, (p) =>
        p.visitor.create({
          data: {
            ...payload,
            email: payload.email.pipe(Option.getOrNull),
            idUserCreator: initiator.id,
            idUserUpdater: initiator.id,
          },
        })
      )
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
