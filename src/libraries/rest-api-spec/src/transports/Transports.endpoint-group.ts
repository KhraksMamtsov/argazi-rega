import { CreateTransportEndpoint } from "./CreateTransport.endpoint.js";
import { HttpApiGroup } from "@effect/platform";

export class TransportsEndpointGroup extends HttpApiGroup.make("Transport").add(
  CreateTransportEndpoint
) {}
