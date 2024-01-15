import { Schema } from "@effect/schema";

export const LatitudeSchema = Schema.SecretFromSelf.pipe(
	Schema.identifier("Latitude"),
	Schema.brand("Latitude")
);

export type LatitudeFrom = Schema.Schema.From<typeof LatitudeSchema>;
export type Latitude = Schema.Schema.To<typeof LatitudeSchema>;
