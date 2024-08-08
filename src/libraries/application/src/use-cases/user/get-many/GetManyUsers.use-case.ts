import { Schema } from "@effect/schema";
import { Effect, Array, HashMap, pipe } from "effect";

import { PrismaServiceTag, UserDbToDomain } from "@argazi/database";

import { type GetManyUsersCommand } from "./GetManyUsers.command.js";

export const GetManyUsersUseCase = ({ payload }: GetManyUsersCommand) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;

    const where =
      payload.type === "id"
        ? { id: { in: [...payload.idsUser] } }
        : { idDwbn: { in: [...payload.idsDwbn] } };

    const users = yield* prismaClient.queryDecode(
      Schema.Array(UserDbToDomain),
      (p) => p.user.findMany({ where })
    );

    if (payload.type === "idDwbn") {
      const usersMap = pipe(
        users,
        Array.map((user) => [user.idDwbn, user] as const),
        HashMap.fromIterable
      );

      return pipe(
        payload.idsDwbn,
        Array.map((id) => HashMap.get(usersMap, id))
      );
    } else {
      const usersMap = pipe(
        users,
        Array.map((user) => [user.id, user] as const),
        HashMap.fromIterable
      );

      return pipe(
        payload.idsUser,
        Array.map((id) => HashMap.get(usersMap, id))
      );
    }
  });
