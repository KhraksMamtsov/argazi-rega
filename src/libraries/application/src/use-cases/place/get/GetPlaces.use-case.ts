import { Schema } from "effect";
import { Effect } from "effect";

import { PlaceDbToDomain, PrismaServiceTag } from "@argazi/database";

import { GetPlacesCommand } from "./GetPlaces.command.js";

import { BaseCausedUseCaseFor } from "../../common/Base.use-case.js";

export const GetPlacesUseCase = BaseCausedUseCaseFor(GetPlacesCommand)(() =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(Schema.Array(PlaceDbToDomain), (p) =>
      p.place.findMany({
        where: {
          dateDeleted: null,
          idUserDeleter: null,
        },
      })
    );
  })
);
