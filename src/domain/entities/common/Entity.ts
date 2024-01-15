import { Schema } from "@effect/schema";

import type { Branded } from "effect/Brand";

export const EntitySchema = <
	R,
	I extends string,
	A extends Branded<string, symbol>,
>(
	idSchema: Schema.Schema<A, I, R>
) =>
	Schema.struct({
		id: idSchema,
	}).pipe(Schema.to, Schema.identifier("EntitySchema"));

export type Entity = Schema.Schema.To<typeof EntitySchema>;
