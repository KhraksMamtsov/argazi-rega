import * as Schema from "@effect/schema/Schema";

import { CreateUserCommandPayloadSchema } from "../../../../application/use-cases/user/create/CreateUser.command.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

export const CreateUserRequest = {
	body: CreateUserCommandPayloadSchema.pipe(
		Schema.identifier("CreateUserRequestBodySchema")
	),
};
export const CreateUserResponseSchema = UserApi.pipe(
	Schema.identifier("CreateUserResponseSchema"),
	BaseResponseFor
);
