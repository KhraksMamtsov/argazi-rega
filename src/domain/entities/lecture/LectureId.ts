import { Schema } from "@effect/schema";

export const LectureIdSymbol: unique symbol = Symbol.for("LectureId");

export const LectureIdSchema = Schema.UUID.pipe(
  Schema.brand(LectureIdSymbol),
  Schema.identifier("LectureIdSchema"),
);

export type LectureId = Schema.Schema.To<typeof LectureIdSchema>;
