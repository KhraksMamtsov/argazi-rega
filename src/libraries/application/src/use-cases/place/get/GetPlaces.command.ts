import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../common/Base.command.js";
import { _SS } from "@argazi/shared";

export const GetPlacesCommandPayloadSchema = Schema.struct({}).pipe(
	_SS.satisfies.from.json(),
	Schema.identifier("GetPlacesCommandPayloadSchema")
);

export const GetPlacesCommandSchema = BaseCausedCommandFor(
	GetPlacesCommandPayloadSchema
).pipe(Schema.identifier("GetPlacesCommandSchema"));
