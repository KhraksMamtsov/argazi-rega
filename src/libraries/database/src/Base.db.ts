import { Schema, AST, ParseResult } from "@effect/schema";
import { Effect, Option, pipe } from "effect";

import {
  type Base,
  BaseSchema,
  IdUserSchema,
  DateCreatedSchema,
  DateDeletedSchema,
  DateUpdatedSchema,
} from "@argazi/domain";
import { _TS } from "@argazi/shared";

const _BaseDbSchema = Schema.Struct({
  dateCreated: Schema.ValidDateFromSelf,
  dateDeleted: Schema.NullOr(Schema.ValidDateFromSelf),
  dateUpdated: Schema.ValidDateFromSelf,
  idUserCreator: Schema.UUID,
  idUserDeleter: Schema.NullOr(Schema.UUID),
  idUserUpdater: Schema.UUID,
}).pipe(Schema.identifier("BaseDbSchema"));

export interface BaseDbFrom
  extends Schema.Schema.Encoded<typeof _BaseDbSchema> {}
export interface BaseDb extends Schema.Schema.Type<typeof _BaseDbSchema> {}
export const BaseDbSchema: Schema.Schema<BaseDb, BaseDbFrom> = _BaseDbSchema;

export const ToDomainBase = Schema.transform(BaseDbSchema, BaseSchema, {
  decode: (x) => ({
    meta: {
      dateCreated: DateCreatedSchema(x.dateCreated),
      dateDeleted: Option.fromNullable(x.dateDeleted).pipe(
        Option.map(DateDeletedSchema)
      ),
      dateUpdated: DateUpdatedSchema(x.dateUpdated),
      idUserCreator: IdUserSchema(x.idUserCreator),
      idUserDeleter: Option.fromNullable(x.idUserDeleter).pipe(
        Option.map(IdUserSchema)
      ),
      idUserUpdater: IdUserSchema(x.idUserUpdater),
    },
  }),
  encode: ({ meta }) => ({
    dateCreated: meta.dateCreated,
    dateDeleted: Option.getOrNull(meta.dateDeleted),
    dateUpdated: meta.dateUpdated,
    idUserCreator: meta.idUserCreator,
    idUserDeleter: Option.getOrNull(meta.idUserDeleter),
    idUserUpdater: meta.idUserUpdater,
  }),
});

export const fromDomain = Schema.encode(ToDomainBase);
export const toDomain = Schema.decode(ToDomainBase);

export const transform = <
  R1,
  R2,
  R3,
  R4,
  A,
  B extends BaseDb,
  C extends Base,
  D,
>(
  from: Schema.Schema<B, A, R1>,
  to: Schema.Schema<D, C, R2>,
  decode: (
    b: _TS.Simplify<Omit<B, keyof BaseDb>>,
    options: AST.ParseOptions,
    ast: AST.AST
  ) => Effect.Effect<
    _TS.Simplify<Omit<C, keyof Base>>,
    ParseResult.ParseIssue,
    R3
  >,
  encode: (
    c: _TS.Simplify<Omit<C, keyof Base>>,
    options: AST.ParseOptions,
    ast: AST.AST
  ) => Effect.Effect<
    _TS.Simplify<Omit<B, keyof BaseDb>>,
    ParseResult.ParseIssue,
    R4
  >
) =>
  Schema.transformOrFail(from, to, {
    decode: (b, options, ast) =>
      pipe(
        Effect.all([
          toDomain(b, options).pipe(Effect.mapError((x) => x.error)),
          decode(b, options, ast),
        ]),
        Effect.map(
          ([meta, rest]) =>
            ({
              ...rest,
              ...meta,
            }) as C
        )
      ),
    encode: ({ meta, ...c }, options, ast) =>
      pipe(
        Effect.all([
          fromDomain({ meta }, options).pipe(Effect.mapError((x) => x.error)),
          encode(c, options, ast),
        ]),
        Effect.map(
          ([meta, rest]) =>
            ({
              ...rest,
              ...meta,
            }) as B
        )
      ),
  });
