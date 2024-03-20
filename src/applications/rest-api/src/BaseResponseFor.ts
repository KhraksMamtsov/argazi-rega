import { AST, Schema } from "@effect/schema";
import { Option, pipe } from "effect";
import { _SS, _S } from "@argazi/shared";
import {
	DateCreatedSchema,
	DateDeletedSchema,
	DateUpdatedSchema,
	IdUserSchema,
	type Base,
} from "@argazi/domain";

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
	}).pipe(_SS.satisfies.from.json(), Schema.identifier("ApiMetaSchema")),
}).pipe(
	_SS.satisfies.from.json(),
	_SS.satisfies.to<Base>(),
	Schema.identifier("ApiBaseSchema")
);

export const _BaseResponseFor = <R, I extends _S.Json.Json, A, R1, I1, A1>(
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
		Schema.struct({ data: Schema.encodedSchema(extendedData) }),
		extendedData,
		(from) => from.data,
		(to) => ({ data: to })
	).pipe(Schema.identifier(baseAnnotation));
};

export const BaseResponseFor = <A, I extends _S.Json.Json, R>(
	data: Schema.Schema<A, I, R>
) => _BaseResponseFor(data, (x) => x.pipe(Schema.extend(ApiBaseSchema)));

export const BaseResponseManyFor = <A, I extends _S.Json.Json, R>(
	data: Schema.Schema<A, I, R>
) =>
	_BaseResponseFor(data, (x) =>
		Schema.array(x.pipe(Schema.extend(ApiBaseSchema)))
	);

export const BaseResponseOptionManyFor = <A, I extends _S.Json.Json, R>(
	data: Schema.Schema<A, I, R>
) =>
	_BaseResponseFor(data, (x) =>
		Schema.array(
			Schema.optionFromNullable(x.pipe(Schema.extend(ApiBaseSchema)))
		)
	);
