import { Schema } from "effect";
import { absurd, Effect } from "effect";

import { PrismaServiceTag, UserDbToDomain } from "@argazi/database";

import { type GetUserCommand } from "./GetUser.command.js";

export const GetUserUseCase = ({ payload }: GetUserCommand) =>
  Effect.gen(function* () {
    const prismaClient = yield* PrismaServiceTag;

    const where =
      payload.type === "id"
        ? { id: payload.id }
        : payload.type === "idDwbn"
          ? { idDwbn: payload.idDwbn }
          : absurd<never>(payload);

    return yield* prismaClient.queryDecode(
      Schema.OptionFromNullOr(UserDbToDomain),
      (p) => p.user.findUnique({ where })
    );
  });
