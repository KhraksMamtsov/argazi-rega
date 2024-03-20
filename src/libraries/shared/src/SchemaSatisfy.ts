import { Schema } from "@effect/schema";

import { type Json } from "./Schema";

const from =
	<From>() =>
	<R, To>(schema: Schema.Schema<To, From, R>) =>
		schema;

from.json =
	<From extends Json.Json>() =>
	<R, To>(schema: Schema.Schema<To, From, R>) =>
		schema;

const to =
	<To>() =>
	<R, From>(schema: Schema.Schema<To, From, R>) =>
		schema;

to.json =
	<To extends Json.Json>() =>
	<R, From>(schema: Schema.Schema<To, From, R>) =>
		schema;

export const satisfies = { from, to };
