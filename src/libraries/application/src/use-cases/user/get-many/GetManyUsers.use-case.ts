import { Schema } from "@effect/schema";
import { Effect, ReadonlyArray, HashMap, pipe } from "effect";

import { PrismaServiceTag, UserDbToDomainSchema } from "@argazi/database";

import { type GetManyUsersCommand } from "./GetManyUsers.command.js";

export const GetManyUsersUseCase = ({ payload }: GetManyUsersCommand) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* _(PrismaServiceTag);

    const where =
      payload.type === "id"
        ? { id: { in: [...payload.idsUser] } }
        : { idDwbn: { in: [...payload.idsDwbn] } };

    const users = yield* _(
      prismaClient.queryDecode(Schema.Array(UserDbToDomainSchema), (p) =>
        p.user.findMany({ where })
      )
    );

    if (payload.type === "idDwbn") {
      const usersMap = pipe(
        users,
        ReadonlyArray.map((user) => [user.idDwbn, user] as const),
        HashMap.fromIterable
      );

      return pipe(
        payload.idsDwbn,
        ReadonlyArray.map((id) => HashMap.get(usersMap, id))
      );
    } else {
      const usersMap = pipe(
        users,
        ReadonlyArray.map((user) => [user.id, user] as const),
        HashMap.fromIterable
      );

      return pipe(
        payload.idsUser,
        ReadonlyArray.map((id) => HashMap.get(usersMap, id))
      );
    }
  });
