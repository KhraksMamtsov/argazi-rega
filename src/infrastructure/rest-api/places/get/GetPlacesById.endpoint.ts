import * as Schema from "@effect/schema/Schema";
import { ApiEndpoint } from "effect-http";

import { IdPlaceSchema } from "../../../../domain/place/entity/IdPlace.js";
import { BaseResponseFor } from "../../BaseResponseFor.js";
import { PlaceApi } from "../Place.api.js";

export const _GetPlaceByIdRequest = Schema.struct({
	idPlace: IdPlaceSchema,
});

interface GetPlaceByIdRequestEncoded
	extends Schema.Schema.Encoded<typeof _GetPlaceByIdRequest> {}
interface GetPlaceByIdRequest
	extends Schema.Schema.Type<typeof _GetPlaceByIdRequest> {}

const GetPlaceByIdRequest: Schema.Schema<
	GetPlaceByIdRequest,
	GetPlaceByIdRequestEncoded
> = _GetPlaceByIdRequest;

export const _GetPlaceByIdResponseBodySchema = PlaceApi.pipe(
	Schema.identifier("GetPlaceByIdResponseSchema"),
	BaseResponseFor
).pipe(Schema.description("Place"));

interface GetPlaceByIdResponseBodyEncoded
	extends Schema.Schema.Encoded<typeof _GetPlaceByIdResponseBodySchema> {}
interface GetPlaceByIdResponseBody
	extends Schema.Schema.Type<typeof _GetPlaceByIdResponseBodySchema> {}

const GetPlaceByIdResponseBodySchema: Schema.Schema<
	GetPlaceByIdResponseBody,
	GetPlaceByIdResponseBodyEncoded
> = _GetPlaceByIdResponseBodySchema;

export const GetPlaceByIdEndpoint = ApiEndpoint.get(
	"getPlaceById",
	"/places/:idPlace"
).pipe(
	ApiEndpoint.setRequestPath(GetPlaceByIdRequest),
	ApiEndpoint.setResponseBody(GetPlaceByIdResponseBodySchema)
);
