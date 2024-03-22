import { Effect, ReadonlyRecord } from "effect";

import { UserType } from "@argazi/domain";

import { MD } from "./Markdown.js";

const userTypToString: ReadonlyRecord.ReadonlyRecord<UserType, string> = {
	[UserType.ADULT]: "Взрослый",
	[UserType.PENSIONER]: "Пенсионер",
	[UserType.STUDENT]: "Студент",
};

export const UserTypeMdComponent = (props: { userType: UserType }) =>
	Effect.gen(function* (_) {
		const { userType } = props;

		return MD.escape(userTypToString[userType]);
	});
