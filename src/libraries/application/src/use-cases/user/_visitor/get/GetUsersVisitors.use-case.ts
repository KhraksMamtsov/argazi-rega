import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PrismaServiceTag, VisitorDbToDomain } from "@argazi/database";

import { GetUsersVisitorsCommand } from "./GetUsersVisitors.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseGetCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetUsersVisitorsUseCase = BaseGetCausedUseCaseFor(
  GetUsersVisitorsCommand
)(({ payload, initiator }, { includeDeleted }) =>
  Effect.gen(function* () {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* new GetEntityAuthorizationError({
        entity: ["User", "Visitor"],
        idInitiator: initiator.id,
        payload,
      });
    }

    const prismaClient = yield* PrismaServiceTag;

    const visitors = yield* prismaClient.queryDecode(
      Schema.Array(VisitorDbToDomain),
      (p) =>
        p.visitor.findMany({
          where: {
            idUser: payload.idUser,
            ...(includeDeleted
              ? {}
              : { dateDeleted: null, idUserDeleter: null }),
          },
        })
    );

    return visitors;
  })
);
