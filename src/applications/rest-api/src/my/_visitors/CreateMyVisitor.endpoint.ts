import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint, ApiResponse } from "effect-http";

import { _CreateUsersVisitorCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { BearerAuth } from "../../BearerAuth.security-scheme.js";
import { VisitorApi } from "../../visitors/Visitor.api.js";

export const CreateMyVisitorResponseBody = VisitorApi.pipe(
  Schema.annotations({ identifier: "CreateMyVisitorResponseBody" }),
  BaseResponseFor
);

// #region CreateMyVisitorRequestBody
const _CreateMyVisitorRequestBody = _CreateUsersVisitorCommandPayload.pipe(
  Schema.omit("idUser"),
  Schema.annotations({ identifier: "CreateMyVisitorRequestBody" })
);

export type CreateMyVisitorRequestBodyContext = Schema.Schema.Context<
  typeof _CreateMyVisitorRequestBody
>;
export interface CreateMyVisitorRequestBodyEncoded
  extends Schema.Schema.Encoded<typeof _CreateMyVisitorRequestBody> {}
export interface CreateMyVisitorRequestBody
  extends Schema.Schema.Type<typeof _CreateMyVisitorRequestBody> {}

export const CreateMyVisitorRequestBody: Schema.Schema<
  CreateMyVisitorRequestBody,
  CreateMyVisitorRequestBodyEncoded
> = _CreateMyVisitorRequestBody;
// #endregion CreateMyVisitorRequestBody

export const CreateMyVisitorResponse = [
  {
    content: CreateMyVisitorResponseBody.pipe(
      Schema.annotations({ description: "My visitor" })
    ),
    status: 200 as const,
  },
  {
    content: Schema.String.pipe(
      Schema.annotations({ description: "User not found" })
    ),
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
  ApiEndpoint.setRequestBody(CreateMyVisitorRequestBody),
  ApiEndpoint.setResponse(
    ApiResponse.make(
      200,
      CreateMyVisitorResponseBody.pipe(
        Schema.annotations({ description: "My visitor" })
      )
    )
  ),
  ApiEndpoint.setSecurity(BearerAuth)
);
