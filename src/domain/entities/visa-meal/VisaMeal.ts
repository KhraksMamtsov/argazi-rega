import { Schema } from "@effect/schema";

import { VisaMealIdSchema } from "./VisaMealId.js";

import { IdMealSchema } from "../../meal/entity/IdMeal.js";
import { BaseSchema } from "../common/Base.js";
import { VisaIdSchema } from "../visa/VisaId.js";

const _VisaMealSchema = Schema.struct({
	id: VisaMealIdSchema,
	idMeal: IdMealSchema,
	idVisa: VisaIdSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("VisaMealSchema"));

export type VisaMealFrom = Schema.Schema.Encoded<typeof _VisaMealSchema>;
export type VisaMealMeal = Schema.Schema.Type<typeof _VisaMealSchema>;

export const VisaMealSchema: Schema.Schema<VisaMealMeal, VisaMealFrom> =
	_VisaMealSchema;
