import { Schema } from "@effect/schema";

import { IdVisitorSchema } from "./IdVisitor.js";
import { VisitorTypeSchema } from "./VisitorType.js";

import { IdUserSchema } from "../../user/entity/IdUser.js";
import { BaseSchema } from "../common/Base.js";

const _VisitorSchema = Schema.struct({
	//
	email: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
	id: IdVisitorSchema,
	idUser: IdUserSchema,
	name: Schema.Trim.pipe(Schema.nonEmpty()),
	type: VisitorTypeSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisitorSchema"));

export type VisitorFrom = Schema.Schema.From<typeof _VisitorSchema>;
export type Visitor = Schema.Schema.To<typeof _VisitorSchema>;

export const VisitorSchema: Schema.Schema<Visitor, VisitorFrom> =
	_VisitorSchema;
