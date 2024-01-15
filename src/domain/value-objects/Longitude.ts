import { Schema } from "@effect/schema";
export const LongitudeSchema = Schema.SecretFromSelf.pipe(
	Schema.identifier("Longitude"),
	Schema.brand("Longitude")
);

export type LongitudeFrom = Schema.Schema.From<typeof LongitudeSchema>;
export type Longitude = Schema.Schema.To<typeof LongitudeSchema>;
