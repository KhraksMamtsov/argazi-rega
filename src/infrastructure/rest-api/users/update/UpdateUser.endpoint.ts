import * as Schema from "@effect/schema/Schema";

import { UpdateUserCommandPayloadSchema } from "../../../../application/use-cases/user/update/UpdateUser.command.js";
import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

export const UpdateUserRequest = {
	body: UpdateUserCommandPayloadSchema.pipe(
		Schema.omit("id"),
		Schema.identifier("UpdateUserRequestBodySchema")
	),
	params: Schema.struct({
		id: IdUserSchema,
	}),
};
export const UpdateUserResponseSchema = UserApi.pipe(
	Schema.identifier("UpdateUserResponseSchema"),
	BaseResponseFor
);
