import { Schema } from "@effect/schema";

import { IdVisitor } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetVisitorByIdCommandPayloadFrom = {
  readonly idVisitor: string;
};

export const GetVisitorByIdCommandPayload = Schema.Struct({
  idVisitor: IdVisitor,
}).pipe(
  _SS.satisfies.encoded.json<GetVisitorByIdCommandPayloadFrom>(),
  Schema.annotations({ identifier: "GetVisitorByIdCommandPayload" })
);

export const GetVisitorByIdCommand = BaseCausedCommandFor(
  GetVisitorByIdCommandPayload
).pipe(Schema.annotations({ identifier: "GetVisitorByIdCommand" }));
