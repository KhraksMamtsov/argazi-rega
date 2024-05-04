import { Schema } from "@effect/schema";

export enum TicketRole {
  ADMIN = "ADMIN",
  CASHIER = "CASHIER",
  CHIEF = "CHIEF",
  LEAD = "LEAD",
  NONE = "NONE",
}

export const TicketRoleSchema = Schema.Enums(TicketRole).pipe(
  Schema.identifier("TicketRole")
);
