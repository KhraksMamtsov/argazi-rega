import { Schema } from "@effect/schema";

import { _SS } from "@argazi/shared";

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

const _CreateEventCommandPayloadSchema = Schema.struct({
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
	_SS.satisfies.from.json<CreateEventCommandPayloadFrom>(),
	Schema.identifier("CreateEventCommandPayloadSchema")
);

export interface CreateEventCommandPayloadEncoded
	extends Schema.Schema.Encoded<typeof _CreateEventCommandPayloadSchema> {}
export interface CreateEventCommandPayload
	extends Schema.Schema.Type<typeof _CreateEventCommandPayloadSchema> {}

export const CreateEventCommandPayloadSchema: Schema.Schema<
	CreateEventCommandPayload,
	CreateEventCommandPayloadEncoded
> = _CreateEventCommandPayloadSchema;

export const _CreateEventCommandSchema = BaseCausedCommandFor(
	CreateEventCommandPayloadSchema
).pipe(Schema.identifier("CreateEventCommandSchema"));

export interface CreateEventCommandFrom
	extends Schema.Schema.Encoded<typeof _CreateEventCommandSchema> {}
export interface CreateEventCommand
	extends Schema.Schema.Type<typeof _CreateEventCommandSchema> {}

export const CreateEventCommandSchema: Schema.Schema<
	CreateEventCommand,
	CreateEventCommandFrom
> = _CreateEventCommandSchema;
