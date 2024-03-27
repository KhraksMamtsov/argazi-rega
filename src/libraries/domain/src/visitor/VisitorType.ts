import { Schema } from "@effect/schema";

export enum VisitorType {
  ADULT = "ADULT",
  CHILD = "CHILD",
  PENSIONER = "PENSIONER",
  STUDENT = "STUDENT",
}

export const VisitorTypeSchema = Schema.enums(VisitorType).pipe(
  Schema.identifier("VisitorTypeSchema")
);
