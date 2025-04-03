import { Schema } from "effect";
import { Effect } from "effect";

import { EventDbToDomain } from "@argazi/database";
import { PrismaServiceTag } from "@argazi/database";

import { GetPlaceActualEventsCommand } from "./GetPlaceActualEvents.command.js";

import { BaseGetCausedUseCaseFor } from "../../../common/Base.use-case.js";

export const GetPlaceActualEventsUseCase = BaseGetCausedUseCaseFor(
  GetPlaceActualEventsCommand
)(({ payload }, { includeDeleted }) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;

    return yield* prismaClient.queryDecode(Schema.Array(EventDbToDomain), (p) =>
      p.event.findMany({
        orderBy: { dateStart: "desc" },
        where: {
          ...(includeDeleted ? {} : { idUserDeleter: null }),
          dateAnnouncement: { lte: new Date() },
          dateFinish: { gte: new Date() },
          idPlace: payload.idPlace,
        },
      })
    );
  })
);
