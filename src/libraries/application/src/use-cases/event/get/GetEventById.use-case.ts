import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { EventDbToDomainSchema } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";

import { GetEventByIdCommandSchema } from "./GetEventById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetEventByIdUseCase = BaseCausedUseCaseFor(
  GetEventByIdCommandSchema
)(({ payload }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* _(PrismaServiceTag);

    return yield* _(
      prismaClient.queryDecode(
        Schema.OptionFromNullOr(EventDbToDomainSchema),
        (p) => p.event.findUnique({ where: { id: payload.id } })
      )
    );
  })
);
