import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { VisitorDbToDomain } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";

import { GetVisitorByIdCommand } from "./GetVisitorById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetVisitorByIdUseCase = BaseCausedUseCaseFor(
  GetVisitorByIdCommand
)(({ payload }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(VisitorDbToDomain),
      (p) => p.visitor.findUnique({ where: { id: payload.idVisitor } })
    );
  })
);
