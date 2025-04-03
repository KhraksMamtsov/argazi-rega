import { Schema } from "effect";

import { _CreateUsersVisitorCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";

import { VisitorApi } from "../../visitors/Visitor.api.js";
import { HttpApiEndpoint } from "@effect/platform";

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

export const CreateMyVisitorEndpoint = HttpApiEndpoint.post(
  "createMyVisitor",
  "/my/visitors"
)
  .setPayload(CreateMyVisitorRequestBody)
  .addSuccess(
    CreateMyVisitorResponseBody.pipe(
      Schema.annotations({ description: "My visitor" })
    )
  )
  .addError(
    Schema.String.pipe(Schema.annotations({ description: "User not found" })),
    { status: 404 }
  );
