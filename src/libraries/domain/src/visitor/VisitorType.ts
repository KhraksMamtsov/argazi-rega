import { Schema } from "effect";

export enum VisitorType {
  ADULT = "ADULT",
  CHILD = "CHILD",
  PENSIONER = "PENSIONER",
  STUDENT = "STUDENT",
}

export const VisitorTypeSchema = Schema.Enums(VisitorType).pipe(
  Schema.annotations({ identifier: "VisitorType" })
);
