import * as Visitor from "@argazi/domain/Visitor";
import { Schema, JSONSchema as JSONSchema_ } from "@effect/schema";
import * as _SS from "@argazi/shared/SchemaSatisfy";
import { mutateTransformationFromAnnotations } from "./Helpers";

export const EmailForm = Schema.NonEmpty.pipe(
  Schema.trimmed(),
  Schema.pattern(/^\S+@\S+\.\S{2,}$/i)
).annotations({
  title: "Email",
  description: "email22",
  identifier: "EmailForm",
});

export const NameForm = Schema.NonEmpty.pipe(Schema.trimmed()).annotations({
  title: "Имя",
  identifier: "NameForm",
});

export const optionalForm = <A, I, R>(schema: Schema.Schema<A, I, R>) =>
  Schema.optional(schema, { as: "Option", exact: true });

export const VisitorForm = Schema.Struct({
  email: optionalForm(EmailForm),
  name: NameForm,
  type: Schema.transformLiterals(
    ["Взрослый", Visitor.VisitorType.ADULT],
    ["Пенсионер", Visitor.VisitorType.PENSIONER],
    ["Студент", Visitor.VisitorType.STUDENT],
    ["Ребенок", Visitor.VisitorType.CHILD]
  ).annotations({
    default: Visitor.VisitorType.ADULT,
    title: "Тип",
  }),
})
  .annotations({
    title: "👤 Посетитель",
    description: "descr",
  })
  .pipe(
    mutateTransformationFromAnnotations({
      title: "👤 Посетитель",
      description: "descr",
    }),
    _SS.satisfies.type<Omit<Visitor.VisitorData, "id" | "idUser">>(),
    _SS.satisfies.encoded.json()
  );

export type VisitorForm = typeof VisitorForm.Type;
export type VisitorFormEncoded = typeof VisitorForm.Encoded;
export const JSONSchema = JSONSchema_.make(VisitorForm);
export const decode = Schema.decodeUnknownEither(VisitorForm, {
  errors: "all",
});
export const is = Schema.is(VisitorForm);
