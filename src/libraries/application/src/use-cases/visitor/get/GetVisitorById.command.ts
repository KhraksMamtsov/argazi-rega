import { Schema } from "@effect/schema";

import { IdVisitorSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetVisitorByIdCommandPayloadFrom = {
  readonly idVisitor: string;
};

export const GetVisitorByIdCommandPayloadSchema = Schema.Struct({
  idVisitor: IdVisitorSchema,
}).pipe(
  _SS.satisfies.from.json<GetVisitorByIdCommandPayloadFrom>(),
  Schema.identifier("GetVisitorByIdCommandPayloadSchema")
);

export const GetVisitorByIdCommandSchema = BaseCausedCommandFor(
  GetVisitorByIdCommandPayloadSchema
).pipe(Schema.identifier("GetVisitorByIdCommandSchema"));
