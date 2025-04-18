import { Schema } from "effect";

export const Latitude = Schema.RedactedFromSelf(Schema.String).pipe(
  Schema.annotations({ identifier: "Latitude" }),
  Schema.brand("Latitude")
);

export interface LatitudeFrom extends Schema.Schema.Encoded<typeof Latitude> {}
export interface Latitude extends Schema.Schema.Type<typeof Latitude> {}
