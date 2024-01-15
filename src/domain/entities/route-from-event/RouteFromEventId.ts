import { Schema } from "@effect/schema";

export const RouteFromEventIdSymbol: unique symbol = Symbol.for(
	"RouteFromEventIdSymbol"
);
export const RouteFromEventIdSchema = Schema.UUID.pipe(
	Schema.brand(RouteFromEventIdSymbol),
	Schema.identifier("RouteFromEventIdSchema")
);
