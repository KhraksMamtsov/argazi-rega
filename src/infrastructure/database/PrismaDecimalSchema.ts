import { Schema } from "@effect/schema";
import * as ParseResult from "@effect/schema/ParseResult";
import { Decimal } from "@prisma/client/runtime/library.js";

import { reverse } from "../../libs/Schema.js";

export const PrismaDecimalFromSelf: Schema.Schema<Decimal> = Schema.declare(
	Decimal.isDecimal.bind(Decimal)
).pipe(Schema.identifier("PrismaDecimalFromSelf"));

export const PrismaDecimal = Schema.transformOrFail(
	Schema.string,
	PrismaDecimalFromSelf,
	(num, _, ast) =>
		ParseResult.try({
			catch: () => ParseResult.type(ast, num),
			try: () => new Decimal(num),
		}),
	(val) => ParseResult.succeed(val.valueOf())
).pipe(Schema.identifier("PrismaDecimal"));

export const BigDecimalFromPrismaDecimal = Schema.compose(
	reverse(PrismaDecimal),
	Schema.BigDecimal
).pipe(Schema.identifier("BigDecimalFromPrismaDecimal"));
