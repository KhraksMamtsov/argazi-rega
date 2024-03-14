import { Schema } from "@effect/schema";

import { IdSubscriptionSchema } from "../../../../domain/subscription/entity/IdSubscription.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const GetSubscriptionByIdCommandPayloadSchema = Schema.struct({
	idSubscription: IdSubscriptionSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("GetSubscriptionByIdCommandPayloadSchema")
);

export type GetSubscriptionByIdCommandPayloadFrom = Schema.Schema.Encoded<
	typeof GetSubscriptionByIdCommandPayloadSchema
>;

export const GetSubscriptionByIdCommandSchema = BaseCausedCommandFor(
	GetSubscriptionByIdCommandPayloadSchema
).pipe(Schema.identifier("GetSubscriptionByIdCommandSchema"));
