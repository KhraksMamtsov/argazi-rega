import * as Schema from "@effect/schema/Schema";

import {
  IdVisitorSchema,
  IdUserSchema,
  VisitorTypeSchema,
  type VisitorData,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

export const _VisitorApi = Schema.struct({
  email: Schema.optionFromNullable(Schema.Trimmed.pipe(Schema.nonEmpty())),
  id: IdVisitorSchema,
  idUser: IdUserSchema,
  name: Schema.Trimmed.pipe(Schema.nonEmpty()),
  type: VisitorTypeSchema,
}).pipe(
  _SS.satisfies.from.json(),
  _SS.satisfies.to<VisitorData>(),
  Schema.identifier("VisitorApi")
);

export interface VisitorApiFrom
  extends Schema.Schema.Encoded<typeof _VisitorApi> {}
export interface VisitorApi extends Schema.Schema.Type<typeof _VisitorApi> {}

export const VisitorApi: Schema.Schema<VisitorApi, VisitorApiFrom> =
  _VisitorApi;
