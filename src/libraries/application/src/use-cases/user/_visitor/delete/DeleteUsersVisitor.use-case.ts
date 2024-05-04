import { Effect } from "effect";

import { PrismaServiceTag, VisitorDbToDomain } from "@argazi/database";
import { NotificationServiceTag, notification } from "@argazi/domain";

import { DeleteUsersVisitorCommand } from "./DeleteUsersVisitor.command.js";

import { DeleteEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const DeleteUsersVisitorUseCase = BaseCausedUseCaseFor(
  DeleteUsersVisitorCommand
)(({ payload, initiator }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;
    const notificationService = yield* NotificationServiceTag;

    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new DeleteEntityAuthorizationError({
        entity: "Visitor",
        idEntity: payload.id,
        idInitiator: initiator.id,
        payload: payload,
      });
    }

    const deletedTicket = yield* prismaClient.queryDecode(
      VisitorDbToDomain,
      (p) =>
        p.visitor.update({
          data: {
            dateDeleted: new Date(),
            idUserDeleter: initiator.id,
          },
          where: {
            id: payload.id,
            idUser: payload.idUser,
          },
        })
    );

    Effect.runFork(
      notificationService.queue(
        notification.visitor("deleted")({
          idEntity: deletedTicket.id,
          idInitiator: initiator.id,
        })
      )
    );

    return deletedTicket;
  })
);
