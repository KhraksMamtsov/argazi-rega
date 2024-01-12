import { Schema } from "@effect/schema";
import { UserOnEventIdSchema } from "./UserOnEventId.js";
import { BaseSchema } from "../common/Base.js";
import { UserIdSchema } from "../user/UserId.js";
import { EventIdSchema } from "../event/EventId.js";
import { TransportOnEventSchema } from "../transport-on-event/TransportOnEvent.js";
import { PriceSchema } from "../../value-objects/Price.js";
import { UserOnEventRoleSchema } from "./UserOnEventRole.js";

const _UserOnEventSchema = Schema.struct({
  id: UserOnEventIdSchema,
  idUser: UserIdSchema,
  idEvent: EventIdSchema,
  idTransportOnEvent: Schema.option(TransportOnEventSchema),
  //
  totalPrice: PriceSchema,
  role: UserOnEventRoleSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("UserOnEventSchema"));

export interface UserOnEventFrom
  extends Schema.Schema.From<typeof _UserOnEventSchema> {}
export interface UserOnEvent
  extends Schema.Schema.To<typeof _UserOnEventSchema> {}

export const UserOnEventSchema: Schema.Schema<UserOnEventFrom, UserOnEvent> =
  _UserOnEventSchema;
