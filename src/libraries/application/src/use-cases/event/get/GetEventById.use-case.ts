import { Schema } from "effect";
import { Effect } from "effect";

import { EventDbToDomain } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";

import { GetEventByIdCommand } from "./GetEventById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetEventByIdUseCase = BaseCausedUseCaseFor(GetEventByIdCommand)(
  ({ payload }) =>
    Effect.gen(function* () {
      const prismaClient = yield* PrismaServiceTag;

      return yield* prismaClient.queryDecode(
        Schema.OptionFromNullOr(EventDbToDomain),
        (p) => p.event.findUnique({ where: { id: payload.id } })
      );
    })
);
