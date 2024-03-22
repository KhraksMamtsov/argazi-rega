import { ParseResult, Schema } from "@effect/schema";
import { Effect } from "effect";

import { type IdEvent, IdEventSchema } from "@argazi/domain";
import { IdPlaceSchema } from "@argazi/domain";
import { IdSubscriptionSchema } from "@argazi/domain";
import { IdTicketSchema, type IdTicket } from "@argazi/domain";

const _CallbackQueryEntitySchema = Schema.union(
	Schema.struct({
		action: Schema.literal("create"),
		id: IdEventSchema,
		type: Schema.literal("Ticket"),
	}),
	Schema.struct({
		action: Schema.literal("delete"),
		id: IdTicketSchema,
		type: Schema.literal("Ticket"),
	}),
	Schema.struct({
		action: Schema.literal("create"),
		id: IdPlaceSchema,
		type: Schema.literal("Subscription"),
	}),
	Schema.struct({
		action: Schema.literal("delete"),
		id: IdSubscriptionSchema,
		type: Schema.literal("Subscription"),
	}),
	Schema.struct({
		action: Schema.literal("get"),
		id: IdPlaceSchema,
		type: Schema.literal("Place"),
	})
).pipe(
	Schema.typeSchema,
	<A, I, R>(
		x: Schema.Schema<A, I, R>
	): Schema.Schema<
		A,
		readonly [I] extends readonly [
			{
				readonly action: infer AIA;
				readonly id: infer AII;
				readonly type: infer AIT;
			},
		]
			? {
					readonly action: AIA;
					readonly id: AII;
					readonly type: AIT;
				}
			: never,
		R
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	> => x as any
);

const MinifiedActionSchema = Schema.transformLiterals(
	["c", "create"],
	["d", "delete"],
	["g", "get"]
	// ["patch", "p"],
);
const decodeMinifiedActionSchema = Schema.decode(MinifiedActionSchema);
const encodeMinifiedActionSchema = Schema.encode(MinifiedActionSchema);
const MinifiedTypeSchema = Schema.transformLiterals(
	//
	["000", "Ticket"],
	["001", "Subscription"],
	["002", "Place"]
);
const decodeMinifiedTypeSchema = Schema.decode(MinifiedTypeSchema);
const encodeMinifiedTypeSchema = Schema.encode(MinifiedTypeSchema);
const isMinifiedActionFrom = Schema.is(
	Schema.encodedSchema(MinifiedActionSchema)
);
const isMinifiedTypeFrom = Schema.is(Schema.encodedSchema(MinifiedTypeSchema));
const isUUID = Schema.is(Schema.UUID);

export const CallbackQueryEntitySchema = Schema.transformOrFail(
	Schema.string,
	_CallbackQueryEntitySchema,
	(x, _, ast) => {
		const splitten = x.split("|");
		if (splitten.length !== 3) {
			return ParseResult.fail(new ParseResult.Type(ast, x));
		}

		const [_action, _type, id] = splitten as [string, string, string];

		if (!isMinifiedActionFrom(_action)) {
			return ParseResult.fail(
				new ParseResult.Type(ast, _action, "action is not c | d | g")
			);
		}
		if (!isMinifiedTypeFrom(_type)) {
			return ParseResult.fail(
				new ParseResult.Type(ast, _action, "type is not minified")
			);
		}
		if (!isUUID(id)) {
			return ParseResult.fail(new ParseResult.Type(ast, id, "id is not UUID"));
		}

		return Effect.all({
			action: decodeMinifiedActionSchema(_action),
			type: decodeMinifiedTypeSchema(_type),
		}).pipe(
			Effect.mapError((x) => x.error),
			Effect.map(
				(x) =>
					({
						...x,
						id: id as IdEvent | IdTicket,
					}) as const
			)
		);
	},
	(data) =>
		Effect.all({
			action: encodeMinifiedActionSchema(data.action),
			type: encodeMinifiedTypeSchema(data.type),
		}).pipe(
			Effect.mapError((x) => x.error),
			Effect.map((x) => [x.action, x.type, data.id].join("|"))
		)
);

export const decode = Schema.decode(CallbackQueryEntitySchema);
export const encode = Schema.encodeSync(CallbackQueryEntitySchema);
