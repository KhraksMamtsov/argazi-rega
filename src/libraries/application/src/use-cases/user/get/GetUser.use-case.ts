import { Schema } from "@effect/schema";
import { absurd, Effect } from "effect";

import { PrismaServiceTag, UserDbToDomainSchema } from "@argazi/database";

import { type GetUserCommand } from "./GetUser.command.js";

export const GetUserUseCase = ({ payload }: GetUserCommand) =>
  Effect.gen(function* (_) {
    const prismaClient = yield* _(PrismaServiceTag);

    const where =
      payload.type === "id"
        ? { id: payload.id }
        : payload.type === "idDwbn"
          ? { idDwbn: payload.idDwbn }
          : absurd<never>(payload);

    return yield* _(
      prismaClient.queryDecode(
        Schema.OptionFromNullOr(UserDbToDomainSchema),
        (p) => p.user.findUnique({ where })
      )
    );
  });
