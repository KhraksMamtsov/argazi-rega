import { Schema } from "effect";

import {
  IdVisitor,
  IdUser,
  VisitorTypeSchema,
  type VisitorData,
} from "@argazi/domain";
import type { Json } from "@argazi/shared/Schema";

export class VisitorApi extends Schema.Class<VisitorApi>("VisitorApi")({
  email: Schema.OptionFromNullOr(Schema.NonEmptyTrimmedString),
  id: IdVisitor,
  idUser: IdUser,
  name: Schema.NonEmptyTrimmedString,
  type: VisitorTypeSchema,
}) {}

VisitorApi.Encoded satisfies Json.Json;
VisitorApi.Type satisfies VisitorData;
