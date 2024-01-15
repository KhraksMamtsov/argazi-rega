import { Schema } from "@effect/schema";

import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const GetPlacesCommandPayloadSchema = Schema.struct({}).pipe(
	satisfies.from.json(),
	Schema.identifier("GetPlacesCommandPayloadSchema")
);

export const GetPlacesCommandSchema = BaseCausedCommandFor(
	GetPlacesCommandPayloadSchema
).pipe(Schema.identifier("GetPlacesCommandSchema"));
