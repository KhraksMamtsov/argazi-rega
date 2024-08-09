import * as Schema from "@effect/schema/Schema";

import { CreateSubscriptionCommandPayload } from "@argazi/application";

import { BaseResponseFor } from "../../BaseResponseFor.js";
import { SubscriptionApi } from "../Subscription.api.js";

export const CreateSubscriptionRequest = {
  body: CreateSubscriptionCommandPayload.pipe(
    Schema.annotations({ identifier: "CreateSubscriptionRequestBody" })
  ),
};

export const CreateSubscriptionResponse = SubscriptionApi.pipe(
  Schema.annotations({ identifier: "CreateSubscriptionResponse" }),
  BaseResponseFor
);
