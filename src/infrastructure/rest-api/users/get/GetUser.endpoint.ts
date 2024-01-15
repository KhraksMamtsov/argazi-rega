import * as Schema from "@effect/schema/Schema";

import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

export const GetUserResponseSchema = UserApi.pipe(
	Schema.identifier("GetUserResponseSchema"),
	BaseResponseFor
);

export const GetUserRequest = {
	params: Schema.struct({
		idUser: IdUserSchema,
	}),
};

export const GetUserResponse = GetUserResponseSchema.pipe(
	Schema.description("User")
);
