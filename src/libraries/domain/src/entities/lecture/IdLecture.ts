import { Schema } from "@effect/schema";

export const IdLectureSymbol: unique symbol = Symbol.for("IdLectureSymbol");

export const IdLecture = Schema.UUID.pipe(
  Schema.brand(IdLectureSymbol),
  Schema.annotations({ identifier: "IdLecture" })
);

export type IdLecture = Schema.Schema.Type<typeof IdLecture>;
