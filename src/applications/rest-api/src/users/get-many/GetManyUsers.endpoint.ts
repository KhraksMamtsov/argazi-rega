import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdUserSchema } from "../../../../libraries/domain/src/user/entity/IdUser.js";
import { BaseResponseOptionManyFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

// #region GetManyUsersResponseBody
const _GetManyUsersResponseBodySchema = UserApi.pipe(
	Schema.identifier("GetManyUsersResponseBodySchema"),
	BaseResponseOptionManyFor
);

export type GetManyUsersResponseBodyContext = Schema.Schema.Context<
	typeof _GetManyUsersResponseBodySchema
>;
export interface GetManyUsersResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _GetManyUsersResponseBodySchema> {}
export interface GetManyUsersResponseBody
	extends Schema.Schema.Type<typeof _GetManyUsersResponseBodySchema> {}

export const GetManyUsersResponseBodySchema: Schema.Schema<
	GetManyUsersResponseBody,
	GetManyUsersResponseBodyEncoded
> = _GetManyUsersResponseBodySchema;
// #endregion GetManyUsersResponseBodySchema

// #region GetManyUsersRequestParams
const _GetManyUsersRequestParamsSchema = Schema.struct({
	idsUser: Schema.array(IdUserSchema),
}).pipe(Schema.identifier("GetManyUsersRequestParamsSchema"));

export type GetManyUsersRequestParamsContext = Schema.Schema.Context<
	typeof _GetManyUsersRequestParamsSchema
>;
export interface GetManyUsersRequestParamsEncoded
	extends Schema.Schema.Encoded<typeof _GetManyUsersRequestParamsSchema> {}
export interface GetManyUsersRequestParams
	extends Schema.Schema.Type<typeof _GetManyUsersRequestParamsSchema> {}

export const GetManyUsersRequestParamsSchema: Schema.Schema<
	GetManyUsersRequestParams,
	GetManyUsersRequestParamsEncoded
> = _GetManyUsersRequestParamsSchema;
// #endregion GetManyUsersRequestParamsSchema

export const GetManyUsersEndpoint = ApiEndpoint.post(
	"getManyUsers",
	"/users/many",
	{}
).pipe(
	//
	ApiEndpoint.setRequestBody(GetManyUsersRequestParamsSchema),
	ApiEndpoint.setResponseBody(GetManyUsersResponseBodySchema)
);
