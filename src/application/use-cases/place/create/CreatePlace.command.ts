import { Schema } from "@effect/schema";

import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreatePlaceCommandPayloadFrom = {
	readonly idGeoPoint: string;
	readonly name: string;
};

export const CreatePlaceCommandPayloadSchema = Schema.struct({
	idGeoPoint: Schema.UUID,
	name: Schema.compose(Schema.Trim, Schema.NonEmpty),
}).pipe(
	satisfies.from.json<CreatePlaceCommandPayloadFrom>(),
	Schema.identifier("CreatePlaceCommandPayloadSchema")
);

export const _CreatePlaceCommandSchema = BaseCausedCommandFor(
	CreatePlaceCommandPayloadSchema
).pipe(Schema.identifier("CreatePlaceCommandSchema"));

export type CreatePlaceCommandFrom = Schema.Schema.Encoded<
	typeof _CreatePlaceCommandSchema
>;
export type CreatePlaceCommand = Schema.Schema.Type<
	typeof _CreatePlaceCommandSchema
>;

export const CreatePlaceCommandSchema: Schema.Schema<
	CreatePlaceCommand,
	CreatePlaceCommandFrom
> = _CreatePlaceCommandSchema;
