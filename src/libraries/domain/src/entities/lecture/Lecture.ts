import { Schema } from "effect";

import { IdLecture } from "./IdLecture.js";

import { IdEvent } from "../../event/entity/IdEvent.js";
import { Price } from "../../value-objects/Price.js";

const _Lecture = Schema.Struct({
  dateFinish: Schema.Option(Schema.Date),
  dateStart: Schema.Date,
  id: IdLecture,
  idEvent: IdEvent,
  name: Schema.Trim.pipe(Schema.nonEmptyString()),
  priceDay: Price,
  priceLecture: Price,
}).pipe(Schema.annotations({ identifier: "Lecture" }));

export type LectureFrom = Schema.Schema.Encoded<typeof _Lecture>;
export type Lecture = Schema.Schema.Type<typeof _Lecture>;

export const Lecture: Schema.Schema<Lecture, LectureFrom> = _Lecture;
