import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdEventSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { TicketApiSchema } from "../../tickets/Ticket.api.js";

export const BookMyTicketResponseSchema = TicketApiSchema.pipe(
	Schema.identifier("BookMyTicketResponseSchema"),
	BaseResponseFor
);

// #region BookMyTicketRequestBody
const _BookMyTicketRequestBodySchema = Schema.struct({
	idEvent: IdEventSchema,
}).pipe(Schema.identifier("BookMyTicketRequestBodySchema"));

export type BookMyTicketRequestBodyContext = Schema.Schema.Context<
	typeof _BookMyTicketRequestBodySchema
>;
export interface BookMyTicketRequestBodyEncoded
	extends Schema.Schema.Encoded<typeof _BookMyTicketRequestBodySchema> {}
export interface BookMyTicketRequestBody
	extends Schema.Schema.Type<typeof _BookMyTicketRequestBodySchema> {}

export const BookMyTicketRequestBodySchema: Schema.Schema<
	BookMyTicketRequestBody,
	BookMyTicketRequestBodyEncoded
> = _BookMyTicketRequestBodySchema;
// #endregion BookMyTicketRequestBodySchema

export const BookMyTicketResponse = [
	{
		content: BookMyTicketResponseSchema.pipe(Schema.description("My ticket")),
		status: 200 as const,
	},
	{
		content: Schema.string.pipe(Schema.description("Event not found")),
		status: 404 as const,
	},
] as const;

export const BookMyTicketEndpoint = ApiEndpoint.post(
	"bookMyTicket",
	"/my/tickets",
	{
		summary: "Book ticket for user on particular event",
	}
).pipe(
	ApiEndpoint.setRequestBody(BookMyTicketRequestBodySchema),
	ApiEndpoint.setSecurity(BearerAuth)
);
