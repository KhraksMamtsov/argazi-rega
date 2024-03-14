import { Schema } from "@effect/schema";

export const LatitudeSchema = Schema.SecretFromSelf.pipe(
	Schema.identifier("Latitude"),
	Schema.brand("Latitude")
);

export type LatitudeFrom = Schema.Schema.Encoded<typeof LatitudeSchema>;
export type Latitude = Schema.Schema.Type<typeof LatitudeSchema>;
