import { Schema } from "@effect/schema";
import * as _SS from "@argazi/shared/SchemaSatisfy";

export const mutateTransformationFromAnnotations =
  <X extends Schema.Schema.Any>(
    annotations: Schema.Annotations.Schema<Schema.Schema.Type<X>>
  ) =>
  (schema: X) => {
    const { ast } = schema;
    if (ast._tag === "Transformation") {
      // @ts-expect-error
      ast.from = Schema.make(ast.from).annotations(annotations).ast;
    }
    return schema;
  };
