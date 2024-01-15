import { Schema } from "@effect/schema";

import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreateGeoPointCommandPayloadFrom = {
	readonly idUser: string;
	readonly latitude: number;
	readonly longitude: number;
	readonly name: string | null;
};

export const CreateGeoPointCommandPayloadSchema = Schema.struct({
	idUser: IdUserSchema,
	latitude: Schema.number,
	longitude: Schema.number,
	name: Schema.optionFromNullable(Schema.Secret),
}).pipe(
	satisfies.from.json<CreateGeoPointCommandPayloadFrom>(),
	Schema.identifier("CreateGeoPointCommandPayloadSchema")
);

export const _CreateGeoPointCommandSchema = BaseCausedCommandFor(
	CreateGeoPointCommandPayloadSchema
).pipe(Schema.identifier("CreateGeoPointCommandSchema"));

export type CreateGeoPointCommandFrom = Schema.Schema.From<
	typeof _CreateGeoPointCommandSchema
>;
export type CreateGeoPointCommand = Schema.Schema.To<
	typeof _CreateGeoPointCommandSchema
>;

export const CreateGeoPointCommandSchema: Schema.Schema<
	CreateGeoPointCommand,
	CreateGeoPointCommandFrom
> = _CreateGeoPointCommandSchema;
