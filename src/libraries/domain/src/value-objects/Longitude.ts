import { Schema } from "@effect/schema";

export const Longitude = Schema.SecretFromSelf.pipe(
  Schema.identifier("Longitude"),
  Schema.brand("Longitude")
);

export interface LongitudeFrom
  extends Schema.Schema.Encoded<typeof Longitude> {}
export interface Longitude extends Schema.Schema.Type<typeof Longitude> {}
