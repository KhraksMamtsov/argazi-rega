import { AST, Schema } from "@effect/schema";
import { Option, pipe } from "effect";

import { IdUserSchema } from "../../domain/user/entity/IdUser.js";
import { DateCreatedSchema } from "../../domain/value-objects/DateCreated.js";
import { DateDeletedSchema } from "../../domain/value-objects/DateDeleted.js";
import { DateUpdatedSchema } from "../../domain/value-objects/DateUpdated.js";
import { type Json } from "../../libs/Schema.js";
import { satisfies } from "../../libs/SchemaSatisfy.js";

import type { Base } from "../../domain/entities/common/Base.js";

export const ApiBaseSchema = Schema.struct({
	meta: Schema.struct({
		dateCreated: Schema.compose(Schema.DateFromString, DateCreatedSchema),
		dateDeleted: Schema.optionFromNullable(
			Schema.compose(Schema.DateFromString, DateDeletedSchema)
		),
		dateUpdated: Schema.compose(Schema.DateFromString, DateUpdatedSchema),
		idUserCreator: IdUserSchema,
		idUserDeleter: Schema.optionFromNullable(IdUserSchema),
		idUserUpdater: IdUserSchema,
	}).pipe(satisfies.from.json(), Schema.identifier("ApiMetaSchema")),
}).pipe(
	satisfies.from.json(),
	satisfies.to<Base>(),
	Schema.identifier("ApiBaseSchema")
);

export const _BaseResponseFor = <R, I extends Json.Json, A, R1, I1, A1>(
	data: Schema.Schema<A, I, R>,
	map: (extendedData: Schema.Schema<A, I, R>) => Schema.Schema<A1, I1, R1>
) => {
	const baseAnnotation = pipe(
		AST.getIdentifierAnnotation(data.ast),
		Option.map((x) => `BaseResponse<${x}>`),
		Option.getOrThrow
	);

	const extendedData = map(data);

	return Schema.transform(
		Schema.struct({ data: Schema.from(extendedData) }),
		extendedData,
		(from) => from.data,
		(to) => ({ data: to })
	).pipe(Schema.identifier(baseAnnotation));
};

export const BaseResponseFor = <A, I extends Json.Json, R>(
	data: Schema.Schema<A, I, R>
) => _BaseResponseFor(data, (x) => x.pipe(Schema.extend(ApiBaseSchema)));

export const BaseResponseManyFor = <A, I extends Json.Json, R>(
	data: Schema.Schema<A, I, R>
) =>
	_BaseResponseFor(data, (x) =>
		Schema.array(x.pipe(Schema.extend(ApiBaseSchema)))
	);

export const BaseResponseOptionManyFor = <A, I extends Json.Json, R>(
	data: Schema.Schema<A, I, R>
) =>
	_BaseResponseFor(data, (x) =>
		Schema.array(
			Schema.optionFromNullable(x.pipe(Schema.extend(ApiBaseSchema)))
		)
	);
