import { Schema } from "effect";
import { Effect } from "effect";

import { GeoPointDbToDomain } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";

import { GetPlaceGeoPointCommand } from "./GetPlaceGeoPoint.command.js";

import { BaseCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceGeoPointUseCase = BaseCausedUseCaseFor(
  GetPlaceGeoPointCommand
)(({ payload }) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(GeoPointDbToDomain),
      (p) =>
        p.place
          .findUnique({
            include: { geoPoint: true },
            where: { id: payload.idPlace },
          })
          .then((x) => x?.geoPoint ?? null)
    );
  })
);
