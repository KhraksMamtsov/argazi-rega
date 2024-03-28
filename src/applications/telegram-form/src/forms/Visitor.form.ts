import {} from "@argazi/rest-api";
import { Schema } from "@effect/schema";

// type asd = Omit<V.VisitorDataEncoded, "id" | "idUser">;

export const VisitorJsonSchema = Schema.struct({
  email: Schema.optional(Schema.Trim.pipe(Schema.nonEmpty())),
  name: Schema.string,
  type: Schema.transformLiterals(
    ["ADULT", V.VisitorType.ADULT],
    ["PENSIONER", V.VisitorType.PENSIONER],
    ["STUDENT", V.VisitorType.STUDENT]
  ),
}); // satisfies Schema.Schema<asd, any>;

// const asd2 = Schema.asSchema(VisitorJsonSchema);
//    ^?
