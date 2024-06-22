import { Schema } from "@effect/schema";
import { type Visitor as _Visitor } from "@prisma/client";
import { Effect } from "effect";

import { IdVisitor, Visitor, VisitorType, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

// #region VisitorDbBase
export const _VisitorDbBase = Schema.Struct({
  email: Schema.OptionFromNullOr(Schema.Trim.pipe(Schema.nonEmpty())),
  id: IdVisitor,
  idUser: IdUser,
  name: Schema.String,
  type: Schema.transformLiterals(
    ["ADULT", VisitorType.ADULT],
    ["STUDENT", VisitorType.STUDENT],
    ["CHILD", VisitorType.CHILD],
    ["PENSIONER", VisitorType.PENSIONER]
  ),
}).pipe(Schema.annotations({ identifier: "VisitorDbBase" }));

export type VisitorDbBaseContext = Schema.Schema.Context<typeof _VisitorDbBase>;
export interface VisitorDbBaseEncoded
  extends Schema.Schema.Encoded<typeof _VisitorDbBase> {}
export interface VisitorDbBase
  extends Schema.Schema.Type<typeof _VisitorDbBase> {}

export const VisitorDbBase: Schema.Schema<VisitorDbBase, VisitorDbBaseEncoded> =
  _VisitorDbBase;
// #endregion VisitorDbBase

// #region VisitorDb
const _VisitorDb = VisitorDbBase.pipe(
  Schema.extend(BaseDb),
  Schema.annotations({ identifier: "VisitorDb" }),
  _SS.satisfies.encoded<_Visitor>()
);

export type VisitorDbContext = Schema.Schema.Context<typeof _VisitorDb>;
export interface VisitorDbEncoded
  extends Schema.Schema.Encoded<typeof _VisitorDb> {}
export interface VisitorDb extends Schema.Schema.Type<typeof _VisitorDb> {}

export const VisitorDb: Schema.Schema<VisitorDb, VisitorDbEncoded> = _VisitorDb;
// #endregion VisitorDb

export const VisitorDbToDomain: Schema.Schema<Visitor, _Visitor> = transform(
  //
  VisitorDb,
  Visitor,
  Effect.succeed,
  Effect.succeed
);
