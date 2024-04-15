import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { GeoPointDbToDomainSchema } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";

import { GetPlaceGeoPointCommandSchema } from "./GetPlaceGeoPoint.command.js";

import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceGeoPointUseCase = BaseCausedUseCaseFor(
  GetPlaceGeoPointCommandSchema
)(({ payload }) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* _(PrismaServiceTag);

    return yield* _(
      prismaClient.queryDecode(
        Schema.OptionFromNullOr(GeoPointDbToDomainSchema),
        (p) =>
          p.place
            .findUnique({
              include: { geoPoint: true },
              where: { id: payload.idPlace },
            })
            .then((x) => x?.geoPoint ?? null)
      )
    );
  })
);
