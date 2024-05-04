import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

// #region GetUserResponseBody
const _GetUserResponseBody = UserApi.pipe(
  Schema.identifier("GetUserResponse"),
  BaseResponseFor
).pipe(Schema.identifier("GetUserResponseBody"));

export type GetUserResponseBodyContext = Schema.Schema.Context<
  typeof _GetUserResponseBody
>;
export interface GetUserResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetUserResponseBody> {}
export interface GetUserResponseBody
  extends Schema.Schema.Type<typeof _GetUserResponseBody> {}

export const GetUserResponseBody: Schema.Schema<
  GetUserResponseBody,
  GetUserResponseBodyEncoded
> = _GetUserResponseBody;
// #endregion GetUserResponseBody

// #region GetUserRequestParams
const _GetUserRequestParams = Schema.Struct({
  idUser: IdUser,
}).pipe(Schema.identifier("GetUserRequestParams"));

export type GetUserRequestParamsContext = Schema.Schema.Context<
  typeof _GetUserRequestParams
>;
export interface GetUserRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetUserRequestParams> {}
export interface GetUserRequestParams
  extends Schema.Schema.Type<typeof _GetUserRequestParams> {}

export const GetUserRequestParams: Schema.Schema<
  GetUserRequestParams,
  GetUserRequestParamsEncoded
> = _GetUserRequestParams;
// #endregion GetUserRequestParams

export const GetUserEndpoint = ApiEndpoint.get(
  "getUser",
  "/users/:idUser",
  {}
).pipe(
  ApiEndpoint.setRequestPath(GetUserRequestParams),
  ApiEndpoint.setResponseBody(GetUserResponseBody)
);
