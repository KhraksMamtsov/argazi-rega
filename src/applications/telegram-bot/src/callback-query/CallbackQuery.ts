import { ParseResult, Schema } from "@effect/schema";
import { Effect } from "effect";

import { IdEvent, IdVisitor } from "@argazi/domain";
import { IdPlace } from "@argazi/domain";
import { IdSubscription } from "@argazi/domain";
import { IdTicket } from "@argazi/domain";

const _CallbackQueryEntity = Schema.Union(
  Schema.Struct({
    action: Schema.Literal("create"),
    id: IdEvent,
    type: Schema.Literal("Ticket"),
  }),
  Schema.Struct({
    action: Schema.Literal("delete"),
    id: IdTicket,
    type: Schema.Literal("Ticket"),
  }),
  Schema.Struct({
    action: Schema.Literal("delete"),
    id: IdVisitor,
    type: Schema.Literal("Visitor"),
  }),
  Schema.Struct({
    action: Schema.Literal("create"),
    id: IdPlace,
    type: Schema.Literal("Subscription"),
  }),
  Schema.Struct({
    action: Schema.Literal("delete"),
    id: IdSubscription,
    type: Schema.Literal("Subscription"),
  }),
  Schema.Struct({
    action: Schema.Literal("get"),
    id: IdPlace,
    type: Schema.Literal("Place"),
  })
).pipe(
  Schema.typeSchema,
  <A, I, R>(
    x: Schema.Schema<A, I, R>
  ): Schema.Schema<
    A,
    readonly [I] extends readonly [
      {
        readonly action: infer AIA;
        readonly id: infer AII;
        readonly type: infer AIT;
      },
    ]
      ? {
          readonly action: AIA;
          readonly id: AII;
          readonly type: AIT;
        }
      : never,
    R
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  > => x as any
);

const MinifiedAction = Schema.transformLiterals(
  ["c", "create"],
  ["d", "delete"],
  ["g", "get"]
  // ["patch", "p"],
);
const decodeMinifiedAction = Schema.decode(MinifiedAction);
const encodeMinifiedAction = Schema.encode(MinifiedAction);
const MinifiedType = Schema.transformLiterals(
  //
  ["000", "Ticket"],
  ["001", "Subscription"],
  ["002", "Place"],
  ["003", "Visitor"]
);
const decodeMinifiedType = Schema.decode(MinifiedType);
const encodeMinifiedType = Schema.encode(MinifiedType);
const isMinifiedActionFrom = Schema.is(Schema.encodedSchema(MinifiedAction));
const isMinifiedTypeFrom = Schema.is(Schema.encodedSchema(MinifiedType));
const isUUID = Schema.is(Schema.UUID);

export const CallbackQueryEntity = Schema.transformOrFail(
  Schema.String,
  _CallbackQueryEntity,
  {
    strict: true,
    decode: (x, _, ast) => {
      const splitten = x.split("|");
      if (splitten.length !== 3) {
        return ParseResult.fail(new ParseResult.Type(ast, x));
      }

      const [_action, _type, id] = splitten as [string, string, string];

      if (!isMinifiedActionFrom(_action)) {
        return ParseResult.fail(
          new ParseResult.Type(ast, _action, "action is not c | d | g")
        );
      }
      if (!isMinifiedTypeFrom(_type)) {
        return ParseResult.fail(
          new ParseResult.Type(ast, _action, "type is not minified")
        );
      }
      if (!isUUID(id)) {
        return ParseResult.fail(
          new ParseResult.Type(ast, id, "id is not UUID")
        );
      }

      return Effect.all({
        action: decodeMinifiedAction(_action),
        type: decodeMinifiedType(_type),
      }).pipe(
        Effect.mapError((x) => x.issue),
        Effect.map(
          (x) =>
            ({
              ...x,
              id: id as IdEvent | IdTicket,
            }) as const
        )
      );
    },
    encode: (data) =>
      Effect.all({
        action: encodeMinifiedAction(data.action),
        type: encodeMinifiedType(data.type),
      }).pipe(
        Effect.mapError((x) => x.issue),
        Effect.map((x) => [x.action, x.type, data.id].join("|"))
      ),
  }
);

export const decode = Schema.decode(CallbackQueryEntity);
export const encode = Schema.encodeSync(CallbackQueryEntity);
