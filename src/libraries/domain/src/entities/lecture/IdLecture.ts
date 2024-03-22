import { Schema } from "@effect/schema";

export const IdLectureSymbol: unique symbol = Symbol.for("IdLectureSymbol");

export const IdLectureSchema = Schema.UUID.pipe(
  Schema.brand(IdLectureSymbol),
  Schema.identifier("IdLectureSchema")
);

export type IdLecture = Schema.Schema.Type<typeof IdLectureSchema>;
