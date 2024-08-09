import { ApiGroup } from "effect-http";

import { CreateTransportEndpoint } from "./CreateTransport.endpoint.js";

export const TransportsEndpointGroup = ApiGroup.make("Transport").pipe(
  ApiGroup.addEndpoint(CreateTransportEndpoint)
);
