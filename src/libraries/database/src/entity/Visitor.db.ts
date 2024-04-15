import { Schema } from "@effect/schema";
import { type Visitor as _Visitor } from "@prisma/client";
import { Effect } from "effect";

import {
  IdVisitorSchema,
  type Visitor,
  VisitorSchema,
  VisitorType,
  IdUserSchema,
} from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";

// #region VisitorDbBase
export const _VisitorDbBaseSchema = Schema.Struct({
  email: Schema.OptionFromNullOr(Schema.Trim.pipe(Schema.nonEmpty())),
  id: IdVisitorSchema,
  idUser: IdUserSchema,
  name: Schema.String,
  type: Schema.transformLiterals(
    ["ADULT", VisitorType.ADULT],
    ["STUDENT", VisitorType.STUDENT],
    ["CHILD", VisitorType.CHILD],
    ["PENSIONER", VisitorType.PENSIONER]
  ),
}).pipe(Schema.identifier("VisitorDbBaseSchema"));

export type VisitorDbBaseContext = Schema.Schema.Context<
  typeof _VisitorDbBaseSchema
>;
export interface VisitorDbBaseEncoded
  extends Schema.Schema.Encoded<typeof _VisitorDbBaseSchema> {}
export interface VisitorDbBase
  extends Schema.Schema.Type<typeof _VisitorDbBaseSchema> {}

export const VisitorDbBaseSchema: Schema.Schema<
  VisitorDbBase,
  VisitorDbBaseEncoded
> = _VisitorDbBaseSchema;
// #endregion VisitorDbBaseSchema

// #region VisitorDb
const _VisitorDbSchema = VisitorDbBaseSchema.pipe(
  Schema.extend(BaseDbSchema),
  Schema.identifier("VisitorDbSchema"),
  _SS.satisfies.from<_Visitor>()
);

export type VisitorDbContext = Schema.Schema.Context<typeof _VisitorDbSchema>;
export interface VisitorDbEncoded
  extends Schema.Schema.Encoded<typeof _VisitorDbSchema> {}
export interface VisitorDb
  extends Schema.Schema.Type<typeof _VisitorDbSchema> {}

export const VisitorDbSchema: Schema.Schema<VisitorDb, VisitorDbEncoded> =
  _VisitorDbSchema;
// #endregion VisitorDbSchema

export const VisitorDbToDomainSchema: Schema.Schema<Visitor, _Visitor> =
  transform(
    //
    VisitorDbSchema,
    VisitorSchema,
    Effect.succeed,
    Effect.succeed
  );
