import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { _CreateUsersVisitorCommandPayloadSchema } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

export const CreateMyVisitorResponseSchema = VisitorApi.pipe(
  Schema.identifier("CreateMyVisitorResponseSchema"),
  BaseResponseFor
);

// #region CreateMyVisitorRequestBody
const _CreateMyVisitorRequestBodySchema =
  _CreateUsersVisitorCommandPayloadSchema.pipe(
    Schema.omit("idUser"),
    Schema.identifier("CreateMyVisitorRequestBodySchema")
  );

export type CreateMyVisitorRequestBodyContext = Schema.Schema.Context<
  typeof _CreateMyVisitorRequestBodySchema
>;
export interface CreateMyVisitorRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateMyVisitorRequestBodySchema> {}
export interface CreateMyVisitorRequestBody
  extends Schema.Schema.Type<typeof _CreateMyVisitorRequestBodySchema> {}

export const CreateMyVisitorRequestBodySchema: Schema.Schema<
  CreateMyVisitorRequestBody,
  CreateMyVisitorRequestBodyEncoded
> = _CreateMyVisitorRequestBodySchema;
// #endregion CreateMyVisitorRequestBodySchema

export const CreateMyVisitorResponse = [
  {
    content: CreateMyVisitorResponseSchema.pipe(
      Schema.description("My visitor")
    ),
    status: 200 as const,
  },
  {
    content: Schema.string.pipe(Schema.description("User not found")),
    status: 404 as const,
  },
] as const;

export const CreateMyVisitorEndpoint = ApiEndpoint.post(
  "createMyVisitor",
  "/my/visitors",
  {
    summary: "Creates visitor",
  }
).pipe(
  ApiEndpoint.setRequestBody(CreateMyVisitorRequestBodySchema),
  ApiEndpoint.setResponse(
    ApiResponse.make(
      200,
      CreateMyVisitorResponseSchema.pipe(Schema.description("My visitor"))
    )
  ),
  ApiEndpoint.setSecurity(BearerAuth)
);
