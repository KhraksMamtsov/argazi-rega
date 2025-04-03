import { Schema } from "effect";

export enum UserType {
  ADULT = "ADULT",
  PENSIONER = "PENSIONER",
  STUDENT = "STUDENT",
}

export class UserTypeSchema extends Schema.Enums(UserType).annotations({
  identifier: "UserType",
}) {}
