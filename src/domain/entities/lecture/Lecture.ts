import { Schema } from "@effect/schema";

import { IdLectureSchema } from "./IdLecture.js";

import { IdEventSchema } from "../../event/entity/IdEvent.js";
import { PriceSchema } from "../../value-objects/Price.js";

const _LectureSchema = Schema.struct({
	dateFinish: Schema.option(Schema.Date),
	dateStart: Schema.Date,
	id: IdLectureSchema,
	idEvent: IdEventSchema,
	name: Schema.Trim.pipe(Schema.nonEmpty()),
	priceDay: PriceSchema,
	priceLecture: PriceSchema,
}).pipe(Schema.identifier("LectureSchema"));

export type LectureFrom = Schema.Schema.From<typeof _LectureSchema>;
export type Lecture = Schema.Schema.To<typeof _LectureSchema>;

export const LectureSchema: Schema.Schema<Lecture, LectureFrom> =
	_LectureSchema;
