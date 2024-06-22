import { Schema } from "@effect/schema";

import { IdVisaMeal } from "./VisaMealId.js";

import { IdMeal } from "../../meal/entity/IdMeal.js";
import { Base } from "../common/Base.js";
import { IdVisa } from "../visa/VisaId.js";

const _VisaMeal = Schema.Struct({
  id: IdVisaMeal,
  idMeal: IdMeal,
  idVisa: IdVisa,
}).pipe(Schema.extend(Base), Schema.annotations({ identifier: "VisaMeal" }));

export type VisaMealFrom = Schema.Schema.Encoded<typeof _VisaMeal>;
export type VisaMealMeal = Schema.Schema.Type<typeof _VisaMeal>;

export const VisaMeal: Schema.Schema<VisaMealMeal, VisaMealFrom> = _VisaMeal;
