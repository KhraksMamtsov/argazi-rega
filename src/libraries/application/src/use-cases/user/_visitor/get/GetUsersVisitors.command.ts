import { Schema } from "@effect/schema";

import { VisitorDbBaseSchema } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

// #region GetUsersVisitorsCommandPayload
export const _GetUsersVisitorsCommandPayloadSchema = VisitorDbBaseSchema.pipe(
  Schema.pick("idUser"),
  Schema.identifier("GetUsersVisitorsCommandPayloadSchema"),
  _SS.satisfies.from.json()
);

export type GetUsersVisitorsCommandPayloadContext = Schema.Schema.Context<
  typeof _GetUsersVisitorsCommandPayloadSchema
>;
export interface GetUsersVisitorsCommandPayloadEncoded
  extends Schema.Schema.Encoded<typeof _GetUsersVisitorsCommandPayloadSchema> {}
export interface GetUsersVisitorsCommandPayload
  extends Schema.Schema.Type<typeof _GetUsersVisitorsCommandPayloadSchema> {}

export const GetUsersVisitorsCommandPayloadSchema: Schema.Schema<
  GetUsersVisitorsCommandPayload,
  GetUsersVisitorsCommandPayloadEncoded
> = _GetUsersVisitorsCommandPayloadSchema;
// #endregion GetUsersVisitorsCommandPayloadSchema

// #region GetUsersVisitorsCommand
export const _GetUsersVisitorsCommandSchema = BaseCausedCommandFor(
  GetUsersVisitorsCommandPayloadSchema
).pipe(Schema.identifier("GetUsersVisitorsCommandSchema"));

export type GetUsersVisitorsCommandContext = Schema.Schema.Context<
  typeof _GetUsersVisitorsCommandSchema
>;
export interface GetUsersVisitorsCommandEncoded
  extends Schema.Schema.Encoded<typeof _GetUsersVisitorsCommandSchema> {}
export interface GetUsersVisitorsCommand
  extends Schema.Schema.Type<typeof _GetUsersVisitorsCommandSchema> {}

export const GetUsersVisitorsCommandSchema: Schema.Schema<
  GetUsersVisitorsCommand,
  GetUsersVisitorsCommandEncoded
> = _GetUsersVisitorsCommandSchema;
// #endregion GetUsersVisitorsCommandSchema
