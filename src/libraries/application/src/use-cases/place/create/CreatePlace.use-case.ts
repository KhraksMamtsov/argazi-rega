import { Effect } from "effect";

import { PlaceDbToDomain, PrismaServiceTag } from "@argazi/database";

import type { CreatePlaceCommand } from "./CreatePlace.command.js";

export const CreatePlaceUseCase = (command: CreatePlaceCommand) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* PrismaServiceTag;

    // create user using domain userService produced new User? + events about its creation???

    const newPlace = yield* prismaClient.queryDecode(PlaceDbToDomain, (p) =>
      p.place.create({
        data: {
          description: command.payload.description,
          idGeoPoint: command.payload.idGeoPoint,
          idUserCreator: command.idInitiator,
          idUserUpdater: command.idInitiator,
          name: command.payload.name,
        },
      })
    );

    return newPlace;
  });
