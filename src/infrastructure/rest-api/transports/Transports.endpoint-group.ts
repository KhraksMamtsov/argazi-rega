import { Api } from "effect-http";

import * as CreateTransportEndpoint from "./CreateTransport.endpoint.js";

export const TransportsEndpointGroup = ApiGroup.make("transport").pipe(
	ApiEndpoint.post("createTransport", "/transports", {
		request: CreateTransportEndpoint.CreateTransportRequest,
		response: CreateTransportEndpoint.CreateTransportResponseSchema,
	})
);
