import { Schema } from "@effect/schema";

import { IdDwbnSchema } from "../../../../domain/user/entity/IdDwbn.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCommandFor } from "../../common/Base.command.js";

export const GetManyUsersCommandPayloadSchema = Schema.union(
	Schema.struct({
		idsUser: Schema.array(IdUserSchema),
		type: Schema.literal("id"),
	}).pipe(satisfies.from.json()),
	Schema.struct({
		idsDwbn: Schema.array(IdDwbnSchema),
		type: Schema.literal("idDwbn"),
	}).pipe(satisfies.from.json())
).pipe(Schema.identifier("GetManyUsersCommandPayloadSchema"));

export const GetManyUsersCommandSchema = BaseCommandFor(
	GetManyUsersCommandPayloadSchema
).pipe(Schema.identifier("GetManyUsersCommandSchema"));

export type GetManyUsersCommand = Schema.Schema.Type<
	typeof GetManyUsersCommandSchema
>;
