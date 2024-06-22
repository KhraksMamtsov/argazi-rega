import { Schema } from "@effect/schema";

import { VisitorDbBase } from "@argazi/database";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

// #region GetUsersVisitorsCommandPayload
export const _GetUsersVisitorsCommandPayload = VisitorDbBase.pipe(
  Schema.pick("idUser"),
  Schema.annotations({ identifier: "GetUsersVisitorsCommandPayload" }),
  _SS.satisfies.encoded.json()
);

export type GetUsersVisitorsCommandPayloadContext = Schema.Schema.Context<
  typeof _GetUsersVisitorsCommandPayload
>;
export interface GetUsersVisitorsCommandPayloadEncoded
  extends Schema.Schema.Encoded<typeof _GetUsersVisitorsCommandPayload> {}
export interface GetUsersVisitorsCommandPayload
  extends Schema.Schema.Type<typeof _GetUsersVisitorsCommandPayload> {}

export const GetUsersVisitorsCommandPayload: Schema.Schema<
  GetUsersVisitorsCommandPayload,
  GetUsersVisitorsCommandPayloadEncoded
> = _GetUsersVisitorsCommandPayload;
// #endregion GetUsersVisitorsCommandPayload

// #region GetUsersVisitorsCommand
export const _GetUsersVisitorsCommand = BaseCausedCommandFor(
  GetUsersVisitorsCommandPayload
).pipe(Schema.annotations({ identifier: "GetUsersVisitorsCommand" }));

export type GetUsersVisitorsCommandContext = Schema.Schema.Context<
  typeof _GetUsersVisitorsCommand
>;
export interface GetUsersVisitorsCommandEncoded
  extends Schema.Schema.Encoded<typeof _GetUsersVisitorsCommand> {}
export interface GetUsersVisitorsCommand
  extends Schema.Schema.Type<typeof _GetUsersVisitorsCommand> {}

export const GetUsersVisitorsCommand: Schema.Schema<
  GetUsersVisitorsCommand,
  GetUsersVisitorsCommandEncoded
> = _GetUsersVisitorsCommand;
// #endregion GetUsersVisitorsCommand
