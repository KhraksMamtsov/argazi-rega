import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { UpdateUserCommandPayload } from "@argazi/application";
import { IdUser } from "@argazi/domain";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { UserApi } from "../User.api.js";

// #region UpdateUserRequestParams
const _UpdateUserRequestParams = Schema.Struct({
  id: IdUser,
}).pipe(Schema.annotations({ identifier: "UpdateUserRequestParams" }));

export type UpdateUserRequestParamsContext = Schema.Schema.Context<
  typeof _UpdateUserRequestParams
>;
export interface UpdateUserRequestParamsEncoded
  extends Schema.Schema.Encoded<typeof _UpdateUserRequestParams> {}
export interface UpdateUserRequestParams
  extends Schema.Schema.Type<typeof _UpdateUserRequestParams> {}

export const UpdateUserRequestParams: Schema.Schema<
  UpdateUserRequestParams,
  UpdateUserRequestParamsEncoded
> = _UpdateUserRequestParams;
// #endregion UpdateUserRequestParams

// #region UpdateUserRequestBody
const _UpdateUserRequestBody = UpdateUserCommandPayload.pipe(
  Schema.omit("id")
).pipe(Schema.annotations({ identifier: "UpdateUserRequestBody" }));

export type UpdateUserRequestBodyContext = Schema.Schema.Context<
  typeof _UpdateUserRequestBody
>;
export interface UpdateUserRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _UpdateUserRequestBody> {}
export interface UpdateUserRequestBody
  extends Schema.Schema.Type<typeof _UpdateUserRequestBody> {}

export const UpdateUserRequestBody: Schema.Schema<
  UpdateUserRequestBody,
  UpdateUserRequestBodyEncoded
> = _UpdateUserRequestBody;
// #endregion UpdateUserRequestBody

// #region UpdateUserResponseBody
const _UpdateUserResponseBody = UserApi.pipe(
  Schema.annotations({ identifier: "_UpdateUserResponseBody" }),
  BaseResponseFor
);

export type UpdateUserResponseBodyContext = Schema.Schema.Context<
  typeof _UpdateUserResponseBody
>;
export interface UpdateUserResponseBodyEncoded
  extends Schema.Schema.Encoded<typeof _UpdateUserResponseBody> {}
export interface UpdateUserResponseBody
  extends Schema.Schema.Type<typeof _UpdateUserResponseBody> {}

export const UpdateUserResponseBody: Schema.Schema<
  UpdateUserResponseBody,
  UpdateUserResponseBodyEncoded
> = _UpdateUserResponseBody;
// #endregion UpdateUserResponseBody

export const UpdateUserEndpoint = HttpApiEndpoint.patch(
  "updateUser",
  "/users/:id"
)
  .addSuccess(UpdateUserResponseBody)
  .setPayload(UpdateUserRequestBody)
  .setPath(UpdateUserRequestParams);
