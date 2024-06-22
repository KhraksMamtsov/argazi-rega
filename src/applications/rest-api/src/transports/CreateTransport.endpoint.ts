import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { CreateTransportCommandPayload } from "@argazi/application";

import { TransportApi } from "./Transport.api.js";

import { BaseResponseFor } from "../BaseResponseFor.js";

// #region CreateTransportRequestBody
const _CreateTransportRequestBody = CreateTransportCommandPayload.pipe(
  Schema.annotations({ identifier: "CreateTransportRequestBody" })
);

export type CreateTransportRequestBodyContext = Schema.Schema.Context<
  typeof _CreateTransportRequestBody
>;
export interface CreateTransportRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateTransportRequestBody> {}
export interface CreateTransportRequestBody
  extends Schema.Schema.Type<typeof _CreateTransportRequestBody> {}

export const CreateTransportRequestBody: Schema.Schema<
  CreateTransportRequestBody,
  CreateTransportRequestBodyEncoded
> = _CreateTransportRequestBody;
// #endregion CreateTransportRequestBody

// #region CreateTransportResponse
const _CreateTransportResponse = TransportApi.pipe(
  Schema.annotations({ identifier: "CreateTransportResponse" }),
  BaseResponseFor
);

export type CreateTransportResponseContext = Schema.Schema.Context<
  typeof _CreateTransportResponse
>;
export interface CreateTransportResponseEncoded
  extends Schema.Schema.Encoded<typeof _CreateTransportResponse> {}
export interface CreateTransportResponse
  extends Schema.Schema.Type<typeof _CreateTransportResponse> {}

export const CreateTransportResponse: Schema.Schema<
  CreateTransportResponse,
  CreateTransportResponseEncoded
> = _CreateTransportResponse;
// #endregion CreateTransportResponse

export const CreateTransportEndpoint = ApiEndpoint.post(
  "createTransport",
  "/transports",
  {}
).pipe(
  ApiEndpoint.setRequestBody(CreateTransportRequestBody),
  ApiEndpoint.setResponseBody(CreateTransportResponse)
);
