import { Schema } from "@effect/schema";

import { IdDwbnSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCommandFor } from "../../common/Base.command.js";

export const GetManyUsersCommandPayloadSchema = Schema.Union(
  Schema.Struct({
    idsUser: Schema.Array(IdUserSchema),
    type: Schema.Literal("id"),
  }).pipe(_SS.satisfies.from.json()),
  Schema.Struct({
    idsDwbn: Schema.Array(IdDwbnSchema),
    type: Schema.Literal("idDwbn"),
  }).pipe(_SS.satisfies.from.json())
).pipe(Schema.identifier("GetManyUsersCommandPayloadSchema"));

export const GetManyUsersCommandSchema = BaseCommandFor(
  GetManyUsersCommandPayloadSchema
).pipe(Schema.identifier("GetManyUsersCommandSchema"));

export type GetManyUsersCommand = Schema.Schema.Type<
  typeof GetManyUsersCommandSchema
>;
