import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { satisfies } from "../../../../libs/SchemaSatisfy.js";
import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const CreateSubscriptionCommandPayloadSchema = Schema.struct({
	idPlace: IdPlaceSchema,
	idUser: IdUserSchema,
}).pipe(
	satisfies.from.json(),
	Schema.identifier("CreateSubscriptionCommandPayloadSchema")
);

export const CreateSubscriptionCommandSchema = BaseCausedCommandFor(
	CreateSubscriptionCommandPayloadSchema
).pipe(Schema.identifier("CreateSubscriptionCommandSchema"));
