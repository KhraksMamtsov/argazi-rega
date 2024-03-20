import { _S } from "@argazi/shared";
import { Schema, ParseResult } from "@effect/schema";
import { Decimal } from "@prisma/client/runtime/library.js";

export const PrismaDecimalFromSelf: Schema.Schema<Decimal> = Schema.declare(
	Decimal.isDecimal.bind(Decimal)
).pipe(Schema.identifier("PrismaDecimalFromSelf"));

export const PrismaDecimal = Schema.transformOrFail(
	Schema.string,
	PrismaDecimalFromSelf,
	(num, _, ast) =>
		ParseResult.try({
			catch: () => new ParseResult.Type(ast, num),
			try: () => new Decimal(num),
		}),
	(val) => ParseResult.succeed(val.valueOf())
).pipe(Schema.identifier("PrismaDecimal"));

export const BigDecimalFromPrismaDecimal = Schema.compose(
	_S.reverse(PrismaDecimal),
	Schema.BigDecimal
).pipe(Schema.identifier("BigDecimalFromPrismaDecimal"));
