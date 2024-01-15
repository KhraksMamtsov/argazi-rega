import { Schema } from "@effect/schema";

import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreateEventCommandPayloadFrom = {
	readonly dateAnnouncement: string;
	readonly dateDeadline: string;
	readonly dateFinish: string;
	readonly dateStart: string;
	readonly idPlace: string;
	readonly name: string;
	readonly priceDay: number;
	readonly priceEvent: number;
};

export const CreateEventCommandPayloadSchema = Schema.struct({
	dateAnnouncement: Schema.compose(
		Schema.DateFromString,
		Schema.ValidDateFromSelf
	),
	dateDeadline: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
	dateFinish: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
	dateStart: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
	idPlace: Schema.UUID,
	name: Schema.compose(Schema.Trim, Schema.NonEmpty),
	priceDay: Schema.JsonNumber,
	priceEvent: Schema.JsonNumber,
}).pipe(
	satisfies.from.json<CreateEventCommandPayloadFrom>(),
	Schema.identifier("CreateEventCommandPayloadSchema")
);

export const _CreateEventCommandSchema = BaseCausedCommandFor(
	CreateEventCommandPayloadSchema
).pipe(Schema.identifier("CreateEventCommandSchema"));

export type CreateEventCommandFrom = Schema.Schema.From<
	typeof _CreateEventCommandSchema
>;
export type CreateEventCommand = Schema.Schema.To<
	typeof _CreateEventCommandSchema
>;

export const CreateEventCommandSchema: Schema.Schema<
	CreateEventCommand,
	CreateEventCommandFrom
> = _CreateEventCommandSchema;
