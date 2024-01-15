import { AST, Schema } from "@effect/schema";
import { Option, pipe } from "effect";

import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";

import type { Json } from "../../../libs/Schema.js";

export const BaseCommandFor = <R, I extends Json.Json, A>(
	payload: Schema.Schema<A, I, R>
) => {
	const baseAnnotation = pipe(
		AST.getIdentifierAnnotation(payload.ast),
		Option.map((x) => `BaseCommand<${x}>`),
		Option.getOrThrow
	);

	return Schema.struct({
		payload,
	}).pipe(Schema.identifier(baseAnnotation));
};

export type BaseCommand = Schema.Schema.To<ReturnType<typeof BaseCommandFor>>;

export const BaseCausedCommandFor = <R, I extends Json.Json, A>(
	payload: Schema.Schema<A, I, R>
) => {
	const baseAnnotation = pipe(
		AST.getIdentifierAnnotation(payload.ast),
		Option.map((x) => `BaseCausedCommand<${x}>`),
		Option.getOrThrow
	);

	return Schema.struct({
		idInitiator: IdUserSchema,
		payload,
	}).pipe(Schema.identifier(baseAnnotation));
};

export type BaseCausedCommand = Schema.Schema.To<
	ReturnType<typeof BaseCausedCommandFor>
>;
