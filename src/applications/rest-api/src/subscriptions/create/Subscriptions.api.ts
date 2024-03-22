import * as Schema from "@effect/schema/Schema";

import { CreateSubscriptionCommandPayloadSchema } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApiSchema } from "../Subscription.api.js";

export const CreateSubscriptionRequest = {
  body: CreateSubscriptionCommandPayloadSchema.pipe(
    Schema.identifier("CreateSubscriptionRequestBodySchema")
  ),
};

export const CreateSubscriptionResponseSchema = SubscriptionApiSchema.pipe(
  Schema.identifier("CreateSubscriptionResponseSchema"),
  BaseResponseFor
);
