import { Schema } from "@effect/schema";
export const LongitudeSchema = Schema.compose(
  Schema.Trim,
  Schema.NonEmpty,
).pipe(Schema.brand("Longitude"), Schema.identifier("Longitude"));

export type LongitudeFrom = Schema.Schema.From<typeof LongitudeSchema>;
export type Longitude = Schema.Schema.To<typeof LongitudeSchema>;
