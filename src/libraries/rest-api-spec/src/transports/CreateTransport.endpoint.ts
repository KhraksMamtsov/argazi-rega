import { Schema } from "effect";
import { HttpApiEndpoint } from "@effect/platform";

import { CreateTransportCommandPayload } from "@argazi/application";

import { TransportApi } from "./Transport.api.js";

import { BaseResponseFor } from "../BaseResponseFor.js";
import { HttpApiUnexpectedServerError } from "../HttpApiError.js";

// #region CreateTransportRequestBody
const CreateTransportRequestBody = CreateTransportCommandPayload;

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

export const CreateTransportEndpoint = HttpApiEndpoint.post(
  "createTransport",
  "/transports"
)
  .setPayload(CreateTransportRequestBody)
  .addSuccess(CreateTransportResponse, {
    status: 202,
  })
  .addError(HttpApiUnexpectedServerError);
