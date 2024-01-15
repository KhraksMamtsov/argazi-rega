import { Schema } from "@effect/schema";

import { IdUserSchema } from "../../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserSubscriptionsCommandPayloadSchema = Schema.struct({
	idUser: IdUserSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("GetUserSubscriptionsCommandPayloadSchema")
);

export type GetUserSubscriptionsCommandPayloadFrom = Schema.Schema.From<
	typeof GetUserSubscriptionsCommandPayloadSchema
>;

export const GetUserSubscriptionsCommandSchema = BaseCausedCommandFor(
	GetUserSubscriptionsCommandPayloadSchema
).pipe(Schema.identifier("GetUserSubscriptionsCommandSchema"));
