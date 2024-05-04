import { Schema } from "@effect/schema";

import { IdDwbn, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCommandFor } from "../../common/Base.command.js";

export type GetUserCommandPayloadFrom =
  | {
      readonly id: string;
      readonly type: "id";
    }
  | {
      readonly idDwbn: string;
      readonly type: "idDwbn";
    };

export const GetUserCommandPayload = Schema.Union(
  Schema.Struct({
    id: IdUser,
    type: Schema.Literal("id"),
  }).pipe(_SS.satisfies.encoded.json()),
  Schema.Struct({
    idDwbn: IdDwbn,
    type: Schema.Literal("idDwbn"),
  }).pipe(_SS.satisfies.encoded.json())
).pipe(Schema.identifier("GetUserCommandPayload"));

export const _GetUserCommand = BaseCommandFor(GetUserCommandPayload).pipe(
  Schema.identifier("GetUserCommand")
);

export type GetUserCommandFrom = Schema.Schema.Encoded<typeof _GetUserCommand>;
export type GetUserCommand = Schema.Schema.Type<typeof _GetUserCommand>;

export const GetUserCommand: Schema.Schema<GetUserCommand, GetUserCommandFrom> =
  _GetUserCommand;
