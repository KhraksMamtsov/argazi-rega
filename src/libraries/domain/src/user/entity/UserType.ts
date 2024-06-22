import { Schema } from "@effect/schema";

export enum UserType {
  ADULT = "ADULT",
  PENSIONER = "PENSIONER",
  STUDENT = "STUDENT",
}

export const UserTypeSchema = Schema.Enums(UserType).pipe(
  Schema.annotations({ identifier: "UserType" })
);
