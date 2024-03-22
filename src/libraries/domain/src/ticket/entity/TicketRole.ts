import { Schema } from "@effect/schema";

export enum TicketRole {
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
  CHIEF = "CHIEF",
  LEAD = "LEAD",
  NONE = "NONE",
}

export const TicketRoleSchema = Schema.enums(TicketRole).pipe(
  Schema.identifier("TicketRoleSchema")
);
