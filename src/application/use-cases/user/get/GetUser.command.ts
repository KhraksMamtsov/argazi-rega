import { Schema } from "@effect/schema";

import { IdDwbnSchema } from "../../../../domain/user/entity/IdDwbn.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCommandFor } from "../../common/Base.command.js";

export type GetUserCommandPayloadFrom =
	| {
			readonly id: string;
			readonly type: "id";
	  }
	| {
			readonly idDwbn: string;
			readonly type: "idDwbn";
	  };

export const GetUserCommandPayloadSchema = Schema.union(
	Schema.struct({
		id: IdUserSchema,
		type: Schema.literal("id"),
	}).pipe(satisfies.from.json()),
	Schema.struct({
		idDwbn: IdDwbnSchema,
		type: Schema.literal("idDwbn"),
	}).pipe(satisfies.from.json())
).pipe(Schema.identifier("GetUserCommandPayloadSchema"));

export const _GetUserCommandSchema = BaseCommandFor(
	GetUserCommandPayloadSchema
).pipe(Schema.identifier("GetUserCommandSchema"));

export type GetUserCommandFrom = Schema.Schema.From<
	typeof _GetUserCommandSchema
>;
export type GetUserCommand = Schema.Schema.To<typeof _GetUserCommandSchema>;

export const GetUserCommandSchema: Schema.Schema<
	GetUserCommand,
	GetUserCommandFrom
> = _GetUserCommandSchema;
