import { Schema } from "@effect/schema";

import { IdDwbnSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

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
	}).pipe(_SS.satisfies.from.json()),
	Schema.struct({
		idDwbn: IdDwbnSchema,
		type: Schema.literal("idDwbn"),
	}).pipe(_SS.satisfies.from.json())
).pipe(Schema.identifier("GetUserCommandPayloadSchema"));

export const _GetUserCommandSchema = BaseCommandFor(
	GetUserCommandPayloadSchema
).pipe(Schema.identifier("GetUserCommandSchema"));

export type GetUserCommandFrom = Schema.Schema.Encoded<
	typeof _GetUserCommandSchema
>;
export type GetUserCommand = Schema.Schema.Type<typeof _GetUserCommandSchema>;

export const GetUserCommandSchema: Schema.Schema<
	GetUserCommand,
	GetUserCommandFrom
> = _GetUserCommandSchema;
