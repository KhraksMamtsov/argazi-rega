import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdUserSchema } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

// #region GetUserResponseBody
const _GetUserResponseBodySchema = UserApi.pipe(
  Schema.identifier("GetUserResponseSchema"),
  BaseResponseFor
).pipe(Schema.identifier("GetUserResponseBodySchema"));

export type GetUserResponseBodyContext = Schema.Schema.Context<
  typeof _GetUserResponseBodySchema
>;
export interface GetUserResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetUserResponseBodySchema> {}
export interface GetUserResponseBody
  extends Schema.Schema.Type<typeof _GetUserResponseBodySchema> {}

export const GetUserResponseBodySchema: Schema.Schema<
  GetUserResponseBody,
  GetUserResponseBodyEncoded
> = _GetUserResponseBodySchema;
// #endregion GetUserResponseBodySchema

// #region GetUserRequestParams
const _GetUserRequestParamsSchema = Schema.struct({
  idUser: IdUserSchema,
}).pipe(Schema.identifier("GetUserRequestParamsSchema"));

export type GetUserRequestParamsContext = Schema.Schema.Context<
  typeof _GetUserRequestParamsSchema
>;
export interface GetUserRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetUserRequestParamsSchema> {}
export interface GetUserRequestParams
  extends Schema.Schema.Type<typeof _GetUserRequestParamsSchema> {}

export const GetUserRequestParamsSchema: Schema.Schema<
  GetUserRequestParams,
  GetUserRequestParamsEncoded
> = _GetUserRequestParamsSchema;
// #endregion GetUserRequestParamsSchema

export const GetUserEndpoint = ApiEndpoint.get(
  "getUser",
  "/users/:idUser",
  {}
).pipe(
  ApiEndpoint.setRequestPath(GetUserRequestParamsSchema),
  ApiEndpoint.setResponseBody(GetUserResponseBodySchema)
);
