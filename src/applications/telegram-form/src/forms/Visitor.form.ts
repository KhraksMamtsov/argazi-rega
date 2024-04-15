import { VisitorType } from "@argazi/domain/Visitor";
import { Schema } from "@effect/schema";

export const VisitorJsonSchema = Schema.Struct({
  email: Schema.optional(
    Schema.Trim.pipe(
      Schema.annotations({
        jsonSchema: { type: "string" },
        title: "Email",
      }),
      Schema.nonEmpty()
    )
  ),
  name: Schema.Trim.pipe(
    Schema.annotations({
      jsonSchema: { type: "string" },
      title: "Имя",
    }),
    Schema.nonEmpty()
  ),
  type: Schema.transformLiterals(
    ["ADULT", VisitorType.ADULT],
    ["PENSIONER", VisitorType.PENSIONER],
    ["STUDENT", VisitorType.STUDENT],
    ["CHILD", VisitorType.CHILD]
  ).annotations({
    default: VisitorType.ADULT,
    title: "Тип",
  }),
}).annotations({
  title: "👤 Посетитель",
}); // satisfies Schema.Schema<asd, any>;
