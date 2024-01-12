import { Schema } from "@effect/schema";

export enum UserOnEventRole {
  ADMIN = "ADMIN",
  LEAD = "LEAD",
  CHIEF = "CHIEF",
  CASHIER = "CASHIER",
  NONE = "NONE",
}

export const UserOnEventRoleSchema = Schema.enums(UserOnEventRole).pipe(
  Schema.identifier("UserOnEventRoleSchema"),
);
