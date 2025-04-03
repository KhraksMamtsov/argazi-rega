import type { Simplify } from "effect/Types";
import type { Schema } from "effect/Schema";

import { type Json } from "./Schema.js";

const encoded =
  <Encoded>() =>
  <X extends Schema.Any>(
    schema: [Schema.Encoded<X>] extends [Encoded]
      ? X
      : {
          expected: Simplify<Encoded>;
          received: Simplify<Schema.Encoded<X>>;
        }
  ): X =>
    schema as X;

encoded.json =
  <Encoded extends Json.Json = Json.Json>() =>
  <X extends Schema.All>(
    schema: [Schema.Encoded<X>] extends [Encoded]
      ? X
      : {
          expected: Simplify<Encoded>;
          received: Simplify<Schema.Encoded<X>>;
        }
  ): X =>
    schema as X;

const type =
  <Type>() =>
  <X extends Schema.Any>(
    schema: [Schema.Type<X>] extends [Type]
      ? X
      : {
          expected: Simplify<Type>;
          received: Simplify<Schema.Type<X>>;
        }
  ) =>
    schema as X;

type.json =
  <Type extends Json.Json>() =>
  <X extends Schema.Any>(
    schema: [Schema.Type<X>] extends [Type]
      ? X
      : {
          expected: Simplify<Type>;
          received: Simplify<Schema.Type<X>>;
        }
  ) =>
    schema;

const context =
  <Context>() =>
  <X extends Schema.Any>(
    schema: [Schema.Context<X>] extends [Context]
      ? X
      : {
          expected: Simplify<Context>;
          received: Simplify<Schema.Context<X>>;
        }
  ) =>
    schema;

context.json =
  <Context extends Json.Json>() =>
  <X extends Schema.Any>(
    schema: [Schema.Context<X>] extends [Context]
      ? X
      : {
          expected: Simplify<Context>;
          received: Simplify<Schema.Context<X>>;
        }
  ) =>
    schema;

export const satisfies = { encoded, type, context };
