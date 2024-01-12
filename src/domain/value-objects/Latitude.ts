import { Schema } from "@effect/schema";

export const LatitudeSchema = Schema.Trim.pipe(
  Schema.nonEmpty(),
  Schema.brand("Latitude"),
  Schema.identifier("Latitude"),
);

export type LatitudeFrom = Schema.Schema.From<typeof LatitudeSchema>;
export type Latitude = Schema.Schema.To<typeof LatitudeSchema>;
