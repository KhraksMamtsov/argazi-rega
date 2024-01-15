import * as Schema from "@effect/schema/Schema";

import { IdUserSchema } from "../../../../domain/user/entity/IdUser.js";
import { BaseResponseOptionManyFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

export const GetManyUsersResponseSchema = UserApi.pipe(
	Schema.identifier("GetManyUsersResponseSchema"),
	BaseResponseOptionManyFor
);
export const GetManyUsersRequest = {
	body: Schema.struct({
		idsUser: Schema.array(IdUserSchema),
	}),
};

export const GetManyUsersResponse = GetManyUsersResponseSchema.pipe(
	Schema.description("ManyUsers")
);
