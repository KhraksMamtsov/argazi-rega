import { Schema } from "effect";
import { Effect } from "effect";

import { PlaceDbToDomain, PrismaServiceTag } from "@argazi/database";

import { GetPlaceByIdCommand } from "./GetPlaceById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetPlaceByIdUseCase = BaseCausedUseCaseFor(GetPlaceByIdCommand)(
  ({ payload }) =>
    Effect.gen(function* () {
      const prismaClient = yield* PrismaServiceTag;

      return yield* prismaClient.queryDecode(
        Schema.OptionFromNullOr(PlaceDbToDomain),
        (p) => p.place.findUnique({ where: { id: payload.id } })
      );
    })
);
