import { Schema } from "@effect/schema";
import { UserIdSchema } from "./UserId.js";
import { BaseSchema } from "../common/Base.js";
import { UserTypeSchema } from "./UserType.js";

const _UserSchema = Schema.struct({
  id: UserIdSchema,
  //
  email: Schema.string,
  phone: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
  password: Schema.Secret,
  firstName: Schema.Trim.pipe(Schema.nonEmpty()),
  lastName: Schema.Trim.pipe(Schema.nonEmpty(), Schema.optionFromSelf),
  isAdmin: Schema.boolean,
  type: UserTypeSchema,
}).pipe(Schema.extend(BaseSchema), Schema.identifier("UserSchema"));

export interface UserFrom extends Schema.Schema.From<typeof _UserSchema> {}
export interface User extends Schema.Schema.To<typeof _UserSchema> {}

export const UserSchema: Schema.Schema<UserFrom, User> = _UserSchema;
