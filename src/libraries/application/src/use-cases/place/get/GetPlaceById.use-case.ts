import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { PlaceDbToDomainSchema, PrismaServiceTag } from "@argazi/database";

import { GetPlaceByIdCommandSchema } from "./GetPlaceById.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetPlaceByIdUseCase = BaseCausedUseCaseFor(
  GetPlaceByIdCommandSchema
)(({ payload }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(PlaceDbToDomainSchema),
      (p) => p.place.findUnique({ where: { id: payload.id } })
    );
  })
);
