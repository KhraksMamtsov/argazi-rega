import { Option, pipe, Schema, SchemaAST as AST } from "effect";

import { IdUser } from "@argazi/domain";
import { _S } from "@argazi/shared";

export const BaseCommandFor = <R, I extends _S.Json.Json, A>(
  payload: Schema.Schema<A, I, R>
) => {
  const baseAnnotation = pipe(
    AST.getIdentifierAnnotation(payload.ast),
    Option.map((x) => `BaseCommand<${x}>`),
    Option.getOrThrow
  );

  return Schema.Struct({
    payload,
  }).pipe(Schema.annotations({ identifier: baseAnnotation }));
};

export type BaseCommand = Schema.Schema.Type<ReturnType<typeof BaseCommandFor>>;

export const BaseCausedCommandFor = <R, I extends _S.Json.Json, A>(
  payload: Schema.Schema<A, I, R>
) => {
  const baseAnnotation = pipe(
    AST.getIdentifierAnnotation(payload.ast),
    Option.map((x) => `BaseCausedCommand<${x}>`),
    Option.getOrThrow
  );

  return Schema.Struct({
    idInitiator: IdUser,
    payload,
  }).pipe(Schema.annotations({ identifier: baseAnnotation }));
};

export type BaseCausedCommand = Schema.Schema.Type<
  ReturnType<typeof BaseCausedCommandFor>
>;
