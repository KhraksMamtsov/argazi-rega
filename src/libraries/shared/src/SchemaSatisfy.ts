import { Schema } from "@effect/schema";

import { type Json } from "./Schema.js";

const encoded =
  <Encoded>() =>
  <R, Type>(schema: Schema.Schema<Type, Encoded, R>) =>
    schema;

encoded.json =
  <Encoded extends Json.Json>() =>
  <R, Type>(schema: Schema.Schema<Type, Encoded, R>) =>
    schema;

const type =
  <Type>() =>
  <R, Encoded>(schema: Schema.Schema<Type, Encoded, R>) =>
    schema;

type.json =
  <Type extends Json.Json>() =>
  <R, Encoded>(schema: Schema.Schema<Type, Encoded, R>) =>
    schema;

export const satisfies = { encoded, type: type };
