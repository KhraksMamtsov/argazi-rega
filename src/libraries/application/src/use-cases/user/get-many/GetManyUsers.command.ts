import { Schema } from "@effect/schema";

import { IdDwbn, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCommandFor } from "../../common/Base.command.js";

export const GetManyUsersCommandPayload = Schema.Union(
  Schema.Struct({
    idsUser: Schema.Array(IdUser),
    type: Schema.Literal("id"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    idsDwbn: Schema.Array(IdDwbn),
    type: Schema.Literal("idDwbn"),
  }).pipe(_SS.satisfies.encoded.json())
).pipe(Schema.annotations({ identifier: "GetManyUsersCommandPayload" }));

export const GetManyUsersCommand = BaseCommandFor(
  GetManyUsersCommandPayload
).pipe(Schema.annotations({ identifier: "GetManyUsersCommand" }));

export type GetManyUsersCommand = Schema.Schema.Type<
  typeof GetManyUsersCommand
>;
