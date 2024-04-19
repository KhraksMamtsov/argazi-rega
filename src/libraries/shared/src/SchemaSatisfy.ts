import { Schema } from "@effect/schema";

import { type Json } from "./Schema.js";

const encoded =
  <Encoded>() =>
  <Context, Type>(schema: Schema.Schema<Type, Encoded, Context>) =>
    schema;

encoded.json =
  <Encoded extends Json.Json>() =>
  <Context, Type>(schema: Schema.Schema<Type, Encoded, Context>) =>
    schema;

const type =
  <Type>() =>
  <Context, Encoded>(schema: Schema.Schema<Type, Encoded, Context>) =>
    schema;

type.json =
  <Type extends Json.Json>() =>
  <Context, Encoded>(schema: Schema.Schema<Type, Encoded, Context>) =>
    schema;

const context =
  <Context>() =>
  <Type, Encoded>(schema: Schema.Schema<Type, Encoded, Context>) =>
    schema;

context.json =
  <Context extends Json.Json>() =>
  <Type, Encoded>(schema: Schema.Schema<Type, Encoded, Context>) =>
    schema;

export const satisfies = { encoded, type, context };
