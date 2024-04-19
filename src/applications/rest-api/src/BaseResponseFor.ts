import { AST, Schema } from "@effect/schema";
import { Option, pipe } from "effect";

import {
  DateCreatedSchema,
  DateDeletedSchema,
  DateUpdatedSchema,
  IdUserSchema,
  type Base,
} from "@argazi/domain";
import { _SS, _S } from "@argazi/shared";

export const ApiBaseSchema = Schema.Struct({
  meta: Schema.Struct({
    dateCreated: Schema.compose(Schema.DateFromString, DateCreatedSchema),
    dateDeleted: Schema.OptionFromNullOr(
      Schema.compose(Schema.DateFromString, DateDeletedSchema)
    ),
    dateUpdated: Schema.compose(Schema.DateFromString, DateUpdatedSchema),
    idUserCreator: IdUserSchema,
    idUserDeleter: Schema.OptionFromNullOr(IdUserSchema),
    idUserUpdater: IdUserSchema,
  }).pipe(_SS.satisfies.encoded.json(), Schema.identifier("ApiMetaSchema")),
}).pipe(
  _SS.satisfies.encoded.json(),
  _SS.satisfies.type<Base>(),
  Schema.identifier("ApiBaseSchema")
);

export const _BaseResponseFor = <R, I extends _S.Json.Json, A, R1, I1, A1>(
  data: Schema.Schema<A, I, R>,
  map: (extendedData: Schema.Schema<A, I, R>) => Schema.Schema<A1, I1, R1>
) => {
  const baseAnnotation = pipe(
    AST.getIdentifierAnnotation(data.ast),
    Option.map((x) => `BaseResponse<${x}>`),
    Option.getOrThrow
  );

  const extendedData = map(data);

  return Schema.transform(
    Schema.Struct({ data: Schema.encodedSchema(extendedData) }),
    extendedData,
    { decode: (from) => from.data, encode: (to) => ({ data: to }) }
  ).pipe(Schema.identifier(baseAnnotation));
};

export const BaseResponseFor = <A, I extends _S.Json.Json, R>(
  data: Schema.Schema<A, I, R>
) => _BaseResponseFor(data, (x) => x.pipe(Schema.extend(ApiBaseSchema)));

export const BaseResponseManyFor = <A, I extends _S.Json.Json, R>(
  data: Schema.Schema<A, I, R>
) =>
  _BaseResponseFor(data, (x) =>
    Schema.Array(x.pipe(Schema.extend(ApiBaseSchema)))
  );

export const BaseResponseOptionManyFor = <A, I extends _S.Json.Json, R>(
  data: Schema.Schema<A, I, R>
) =>
  _BaseResponseFor(data, (x) =>
    Schema.Array(Schema.OptionFromNullOr(x.pipe(Schema.extend(ApiBaseSchema))))
  );
