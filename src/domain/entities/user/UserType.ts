import { Schema } from "@effect/schema";

export enum UserType {
  ADULT = "ADULT",
  STUDENT = "STUDENT",
  PENSIONER = "PENSIONER",
}

export const UserTypeSchema = Schema.enums(UserType).pipe(
  Schema.identifier("UserTypeSchema"),
);
