import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { IdUser } from "@argazi/domain";

import { BaseResponseOptionManyFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

// #region GetManyUsersResponseBody
const _GetManyUsersResponseBody = UserApi.pipe(
  Schema.annotations({ identifier: "GetManyUsersResponseBody" }),
  BaseResponseOptionManyFor
);

export type GetManyUsersResponseBodyContext = Schema.Schema.Context<
  typeof _GetManyUsersResponseBody
>;
export interface GetManyUsersResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _GetManyUsersResponseBody> {}
export interface GetManyUsersResponseBody
  extends Schema.Schema.Type<typeof _GetManyUsersResponseBody> {}

export const GetManyUsersResponseBody: Schema.Schema<
  GetManyUsersResponseBody,
  GetManyUsersResponseBodyEncoded
> = _GetManyUsersResponseBody;
// #endregion GetManyUsersResponseBody

// #region GetManyUsersRequestParams
const _GetManyUsersRequestParams = Schema.Struct({
  idsUser: Schema.Array(IdUser),
}).pipe(Schema.annotations({ identifier: "GetManyUsersRequestParams" }));

export type GetManyUsersRequestParamsContext = Schema.Schema.Context<
  typeof _GetManyUsersRequestParams
>;
export interface GetManyUsersRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _GetManyUsersRequestParams> {}
export interface GetManyUsersRequestParams
  extends Schema.Schema.Type<typeof _GetManyUsersRequestParams> {}

export const GetManyUsersRequestParams: Schema.Schema<
  GetManyUsersRequestParams,
  GetManyUsersRequestParamsEncoded
> = _GetManyUsersRequestParams;
// #endregion GetManyUsersRequestParams

export const GetManyUsersEndpoint = HttpApiEndpoint.post(
  "getManyUsers",
  "/users/many"
)
  .setPayload(GetManyUsersRequestParams)
  .addSuccess(GetManyUsersResponseBody);
