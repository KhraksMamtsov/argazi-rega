import { Schema } from "@effect/schema";

export enum UserType {
	ADULT = "ADULT",
	PENSIONER = "PENSIONER",
	STUDENT = "STUDENT",
}

export const UserTypeSchema = Schema.enums(UserType).pipe(
	Schema.identifier("UserTypeSchema")
);
