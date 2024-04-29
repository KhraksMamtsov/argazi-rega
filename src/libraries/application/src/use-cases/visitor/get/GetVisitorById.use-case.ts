import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { VisitorDbToDomainSchema } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";

import { GetVisitorByIdCommandSchema } from "./GetVisitorById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetVisitorByIdUseCase = BaseCausedUseCaseFor(
  GetVisitorByIdCommandSchema
)(({ payload }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(VisitorDbToDomainSchema),
      (p) => p.visitor.findUnique({ where: { id: payload.idVisitor } })
    );
  })
);
