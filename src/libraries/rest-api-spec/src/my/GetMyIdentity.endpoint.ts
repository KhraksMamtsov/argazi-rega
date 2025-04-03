import { Schema } from "effect";

import { BaseResponseFor } from "../BaseResponseFor.js";
import { UserApi } from "../users/User.api.js";
import { HttpApiEndpoint } from "@effect/platform";

export const _GetMyIdentityResponse = UserApi.pipe(
  Schema.annotations({ identifier: "GetMyIdentityResponse" }),
  BaseResponseFor
);

export interface GetMyIdentityResponseFrom
  extends Schema.Schema.Encoded<typeof _GetMyIdentityResponse> {}
export interface GetMyIdentityResponse
  extends Schema.Schema.Type<typeof _GetMyIdentityResponse> {}

export const GetMyIdentityResponse: Schema.Schema<
  GetMyIdentityResponse,
  GetMyIdentityResponseFrom
> = _GetMyIdentityResponse;

export const GetMyIdentityEndpoint = HttpApiEndpoint.get(
  "getMyIdentity",
  "/my/identity"
).addSuccess(GetMyIdentityResponse);
