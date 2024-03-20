import { Schema } from "@effect/schema";

import { BaseCommandFor } from "../../common/Base.command.js";
import { IdDwbnSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const GetManyUsersCommandPayloadSchema = Schema.union(
	Schema.struct({
		idsUser: Schema.array(IdUserSchema),
		type: Schema.literal("id"),
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		idsDwbn: Schema.array(IdDwbnSchema),
		type: Schema.literal("idDwbn"),
	}).pipe(_SS.satisfies.from.json())
).pipe(Schema.identifier("GetManyUsersCommandPayloadSchema"));

export const GetManyUsersCommandSchema = BaseCommandFor(
	GetManyUsersCommandPayloadSchema
).pipe(Schema.identifier("GetManyUsersCommandSchema"));

export type GetManyUsersCommand = Schema.Schema.Type<
	typeof GetManyUsersCommandSchema
>;
