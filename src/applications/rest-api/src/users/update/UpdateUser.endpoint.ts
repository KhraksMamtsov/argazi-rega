import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { UpdateUserCommandPayloadSchema } from "@argazi/application";
import { IdUserSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { UserApi } from "../User.api.js";

// #region UpdateUserRequestParams
const _UpdateUserRequestParamsSchema = Schema.struct({
	id: IdUserSchema,
}).pipe(Schema.identifier("UpdateUserRequestParamsSchema"));

export type UpdateUserRequestParamsContext = Schema.Schema.Context<
	typeof _UpdateUserRequestParamsSchema
>;
export interface UpdateUserRequestParamsEncoded
	extends Schema.Schema.Encoded<typeof _UpdateUserRequestParamsSchema> {}
export interface UpdateUserRequestParams
	extends Schema.Schema.Type<typeof _UpdateUserRequestParamsSchema> {}

export const UpdateUserRequestParamsSchema: Schema.Schema<
	UpdateUserRequestParams,
	UpdateUserRequestParamsEncoded
> = _UpdateUserRequestParamsSchema;
// #endregion UpdateUserRequestParamsSchema

// #region UpdateUserRequestBody
const _UpdateUserRequestBodySchema = UpdateUserCommandPayloadSchema.pipe(
	Schema.omit("id")
).pipe(Schema.identifier("UpdateUserRequestBodySchema"));

export type UpdateUserRequestBodyContext = Schema.Schema.Context<
	typeof _UpdateUserRequestBodySchema
>;
export interface UpdateUserRequestBodyEncoded
	extends Schema.Schema.Encoded<typeof _UpdateUserRequestBodySchema> {}
export interface UpdateUserRequestBody
	extends Schema.Schema.Type<typeof _UpdateUserRequestBodySchema> {}

export const UpdateUserRequestBodySchema: Schema.Schema<
	UpdateUserRequestBody,
	UpdateUserRequestBodyEncoded
> = _UpdateUserRequestBodySchema;
// #endregion UpdateUserRequestBodySchema

// #region UpdateUserResponseBody
const _UpdateUserResponseBodySchema = UserApi.pipe(
	Schema.identifier("_UpdateUserResponseBodySchema"),
	BaseResponseFor
);

export type UpdateUserResponseBodyContext = Schema.Schema.Context<
	typeof _UpdateUserResponseBodySchema
>;
export interface UpdateUserResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _UpdateUserResponseBodySchema> {}
export interface UpdateUserResponseBody
	extends Schema.Schema.Type<typeof _UpdateUserResponseBodySchema> {}

export const UpdateUserResponseBodySchema: Schema.Schema<
	UpdateUserResponseBody,
	UpdateUserResponseBodyEncoded
> = _UpdateUserResponseBodySchema;
// #endregion UpdateUserResponseBodySchema

export const UpdateUserEndpoint = ApiEndpoint.patch(
	"updateUser",
	"/users/:id",
	{}
).pipe(
	ApiEndpoint.setRequestPath(UpdateUserRequestParamsSchema),
	ApiEndpoint.setRequestBody(UpdateUserRequestBodySchema),
	ApiEndpoint.setResponseBody(UpdateUserResponseBodySchema),
	ApiEndpoint.setSecurity(BearerAuth)
);
