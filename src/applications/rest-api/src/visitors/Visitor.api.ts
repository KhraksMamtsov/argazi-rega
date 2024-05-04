import * as Schema from "@effect/schema/Schema";

import {
  IdVisitor,
  IdUser,
  VisitorTypeSchema,
  type VisitorData,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _VisitorApi = Schema.Struct({
  email: Schema.OptionFromNullOr(Schema.Trimmed.pipe(Schema.nonEmpty())),
  id: IdVisitor,
  idUser: IdUser,
  name: Schema.Trimmed.pipe(Schema.nonEmpty()),
  type: VisitorTypeSchema,
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<VisitorData>(),
  Schema.identifier("VisitorApi")
);

export interface VisitorApiFrom
  extends Schema.Schema.Encoded<typeof _VisitorApi> {}
export interface VisitorApi extends Schema.Schema.Type<typeof _VisitorApi> {}

export const VisitorApi: Schema.Schema<VisitorApi, VisitorApiFrom> =
  _VisitorApi;
