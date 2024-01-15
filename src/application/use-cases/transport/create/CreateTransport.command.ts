import { Schema } from "@effect/schema";

import {
	type TransportDbFrom,
	TransportDbSchema,
} from "../../../../infrastructure/database/entity/Transport.db.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreateTransportCommandPayload = Pick<
	TransportDbFrom,
	"idUser" | "number" | "model" | "color" | "seatsNumber"
>;

export const CreateTransportCommandPayloadSchema = TransportDbSchema.pipe(
	Schema.pick("idUser", "number", "model", "color", "seatsNumber"),
	Schema.identifier("CreateTransportCommandPayloadSchema")
).pipe(satisfies.from<CreateTransportCommandPayload>());

export const CreateTransportCommandSchema = BaseCausedCommandFor(
	CreateTransportCommandPayloadSchema
).pipe(Schema.identifier("CreateTransportCommandSchema"));

export type CreateTransportCommandFrom = Schema.Schema.From<
	typeof CreateTransportCommandSchema
>;
export type CreateTransportCommand = Schema.Schema.To<
	typeof CreateTransportCommandSchema
>;
