import { Schema } from "@effect/schema";

import { IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserSubscriptionsCommandPayloadSchema = Schema.struct({
	idUser: IdUserSchema,
}).pipe(
	_SS.satisfies.from.json(),
	Schema.identifier("GetUserSubscriptionsCommandPayloadSchema")
);

export type GetUserSubscriptionsCommandPayloadFrom = Schema.Schema.Encoded<
	typeof GetUserSubscriptionsCommandPayloadSchema
>;

export const GetUserSubscriptionsCommandSchema = BaseCausedCommandFor(
	GetUserSubscriptionsCommandPayloadSchema
).pipe(Schema.identifier("GetUserSubscriptionsCommandSchema"));
