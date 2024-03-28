import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PrismaServiceTag, VisitorDbToDomainSchema } from "@argazi/database";

import { GetUsersVisitorsCommandSchema } from "./GetUsersVisitors.command.js";

import { GetEntityAuthorizationError } from "../../../common/AuthorizationError.js";
import { BaseGetCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetUsersVisitorsUseCase = BaseGetCausedUseCaseFor(
  GetUsersVisitorsCommandSchema
)(({ payload, initiator }, { includeDeleted }) =>
  Effect.gen(function* (_) {
    if (!initiator.isAdmin && initiator.id !== payload.idUser) {
      yield* _(
        new GetEntityAuthorizationError({
          entity: ["User", "Visitor"],
          idInitiator: initiator.id,
          payload,
        })
      );
    }

    const prismaClient = yield* _(PrismaServiceTag);

    const visitors = yield* _(
      prismaClient.queryDecode(Schema.array(VisitorDbToDomainSchema), (p) =>
        p.visitor.findMany({
          where: {
            idUser: payload.idUser,
            ...(includeDeleted
              ? {}
              : { dateDeleted: null, idUserDeleter: null }),
          },
        })
      )
    );

    return visitors;
  })
);
