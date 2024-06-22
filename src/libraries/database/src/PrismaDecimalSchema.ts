import { Schema, ParseResult } from "@effect/schema";
import { Decimal } from "@prisma/client/runtime/library.js";

import { _S } from "@argazi/shared";

export const PrismaDecimalFromSelf: Schema.Schema<Decimal> = Schema.declare(
  Decimal.isDecimal.bind(Decimal)
).pipe(Schema.annotations({ identifier: "PrismaDecimalFromSelf" }));

export const PrismaDecimal = Schema.transformOrFail(
  Schema.String,
  PrismaDecimalFromSelf,
  {
    decode: (num, _, ast) =>
      ParseResult.try({
        catch: () => new ParseResult.Type(ast, num),
        try: () => new Decimal(num),
      }),
    encode: (val) => ParseResult.succeed(val.valueOf()),
  }
).pipe(Schema.annotations({ identifier: "PrismaDecimal" }));

export const BigDecimalFromPrismaDecimal = Schema.compose(
  _S.reverse(PrismaDecimal),
  Schema.BigDecimal
).pipe(Schema.annotations({ identifier: "BigDecimalFromPrismaDecimal" }));
