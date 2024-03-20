import { Effect } from "effect";

import type { CreatePlaceCommand } from "./CreatePlace.command.js";
import { PlaceDbToDomainSchema, PrismaServiceTag } from "@argazi/database";

export const CreatePlaceUseCase = (command: CreatePlaceCommand) =>
	Effect.gen(function* (_) {
		const prismaClient = yield* _(PrismaServiceTag);

		// create user using domain userService produced new User? + events about its creation???

		const newPlace = yield* _(
			prismaClient.queryDecode(PlaceDbToDomainSchema, (p) =>
				p.place.create({
					data: {
						idGeoPoint: command.payload.idGeoPoint,
						idUserCreator: command.idInitiator,
						idUserUpdater: command.idInitiator,
						name: command.payload.name,
					},
				})
			)
		);

		return newPlace;
	});
