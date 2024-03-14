import { Schema } from "@effect/schema";

import { IdSubscriptionSchema } from "../../../../../domain/subscription/entity/IdSubscription.js";
import { IdUserSchema } from "../../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const DeleteUserSubscriptionCommandPayloadSchema = Schema.struct({
	idSubscription: IdSubscriptionSchema,
	idUser: IdUserSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("DeleteUserSubscriptionCommandPayloadSchema")
);

export type DeleteUserSubscriptionCommandPayloadFrom = Schema.Schema.Encoded<
	typeof DeleteUserSubscriptionCommandPayloadSchema
>;

export const DeleteUserSubscriptionCommandSchema = BaseCausedCommandFor(
	DeleteUserSubscriptionCommandPayloadSchema
).pipe(Schema.identifier("DeleteUserSubscriptionCommandSchema"));
