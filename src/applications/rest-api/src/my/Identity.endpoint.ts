import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { BaseResponseFor } from "../BaseResponseFor.js";
import { BearerAuth } from "../BearerAuth.security-scheme.js";
import { UserApi } from "../users/User.api.js";

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

export const GetMyIdentityEndpoint = ApiEndpoint.get(
  "getMyIdentity",
  "/my/identity",
  {
    summary: "Get user",
  }
).pipe(
  ApiEndpoint.setResponseBody(GetMyIdentityResponse),
  ApiEndpoint.setSecurity(BearerAuth)
);
