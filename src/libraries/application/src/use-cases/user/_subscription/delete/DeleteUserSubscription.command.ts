import { Schema } from "@effect/schema";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";
import { IdSubscriptionSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const DeleteUserSubscriptionCommandPayloadSchema = Schema.struct({
	idSubscription: IdSubscriptionSchema,
	idUser: IdUserSchema,
}).pipe(
	_SS.satisfies.from.json(),
	Schema.identifier("DeleteUserSubscriptionCommandPayloadSchema")
);

export type DeleteUserSubscriptionCommandPayloadFrom = Schema.Schema.Encoded<
	typeof DeleteUserSubscriptionCommandPayloadSchema
>;

export const DeleteUserSubscriptionCommandSchema = BaseCausedCommandFor(
	DeleteUserSubscriptionCommandPayloadSchema
).pipe(Schema.identifier("DeleteUserSubscriptionCommandSchema"));