import * as Schema from "@effect/schema/Schema";

import { CreateSubscriptionCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../Subscription.api.js";

export const CreateSubscriptionRequest = {
  body: CreateSubscriptionCommandPayload.pipe(
    Schema.identifier("CreateSubscriptionRequestBody")
  ),
};

export const CreateSubscriptionResponse = SubscriptionApi.pipe(
  Schema.identifier("CreateSubscriptionResponse"),
  BaseResponseFor
);
