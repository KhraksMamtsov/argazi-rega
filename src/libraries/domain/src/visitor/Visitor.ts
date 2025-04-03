import { Schema } from "effect";

import { IdVisitor } from "./IdVisitor.js";
import { VisitorTypeSchema } from "./VisitorType.js";

import { Base } from "../entities/common/Base.js";
import { IdUser } from "../user/entity/IdUser.js";

// #region VisitorData
export const _VisitorData = Schema.Struct({
  email: Schema.OptionFromSelf(Schema.Trim.pipe(Schema.nonEmptyString())),
  id: IdVisitor,
  idUser: IdUser,
  name: Schema.Trim.pipe(Schema.nonEmptyString()),
  type: VisitorTypeSchema,
}).pipe(Schema.annotations({ identifier: "VisitorData" }));

export type VisitorDataContext = Schema.Schema.Context<typeof _VisitorData>;
export interface VisitorDataEncoded
  extends Schema.Schema.Encoded<typeof _VisitorData> {}
export interface VisitorData extends Schema.Schema.Type<typeof _VisitorData> {}

export const VisitorData: Schema.Schema<VisitorData, VisitorDataEncoded> =
  _VisitorData;
// #endregion VisitorDataSchema

// #region Visitor
export const _Visitor = VisitorData.pipe(
  Schema.extend(Base),
  Schema.annotations({ identifier: "Visitor" })
);

export type VisitorContext = Schema.Schema.Context<typeof _Visitor>;
export interface VisitorEncoded
  extends Schema.Schema.Encoded<typeof _Visitor> {}
export interface Visitor extends Schema.Schema.Type<typeof _Visitor> {}

export const Visitor: Schema.Schema<Visitor> = Schema.typeSchema(_Visitor);
// #endregion VisitorSchema
