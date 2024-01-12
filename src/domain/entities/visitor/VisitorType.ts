import { Schema } from "@effect/schema";

export enum VisitorType {
  ADULT = "ADULT",
  STUDENT = "STUDENT",
  PENSIONER = "PENSIONER",
}

export const VisitorTypeSchema = Schema.enums(VisitorType).pipe(
  Schema.identifier("VisitorTypeSchema"),
);
