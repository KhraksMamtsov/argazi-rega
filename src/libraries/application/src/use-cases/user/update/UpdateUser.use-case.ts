import { Schema } from "@effect/schema";
import { Effect } from "effect";

import { UserDbToDomain, PrismaServiceTag } from "@argazi/database";

import {
  type UpdateUserCommand,
  UpdateUserCommandPayload,
} from "./UpdateUser.command.js";

const encodePayload = Schema.encode(UpdateUserCommandPayload);

export const UpdateUserUseCase = (command: UpdateUserCommand) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;

    const { id, ...rest } = yield* encodePayload(command.payload);

    // create user using domain userService produced new User? + events about its creation???
    return yield* prismaClient.update("user", UserDbToDomain, {
      data: { ...rest, idUserUpdater: command.idInitiator },
      where: { id },
    });
  });
