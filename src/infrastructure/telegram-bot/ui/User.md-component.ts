import { Effect, Secret, Option, pipe } from "effect";

import { MD } from "./Markdown.js";
import { UserTypeMdComponent } from "./UserType.md-component.js";

import type { User } from "../../../domain/user/entity/User.js";

export const UserMdComponent = (props: { user: User }) =>
	Effect.gen(function* (_) {
		const { user } = props;

		return yield* _(
			MD.document(
				MD.headline("🧘 Пользователь"),
				MD.dl()(
					[
						"Имя",
						pipe(
							//
							user.firstName,
							Secret.value,
							MD.escape,
							MD.bold
						),
					],
					[
						"Фамилия",
						pipe(
							user.lastName,
							Option.match({
								onNone: () => "❌",
								onSome: Secret.value,
							}),
							MD.escape,
							MD.bold
						),
					],
					["Email", pipe(user.email, Secret.value, MD.escape, MD.bold)],
					[
						"Телефон",
						pipe(
							user.phone,
							Option.match({
								onNone: () => "❌",
								onSome: Secret.value,
							}),
							MD.escape,
							MD.bold
						),
					],
					["Тип", MD.bold(UserTypeMdComponent({ userType: user.type }))]
				)
			)
		);
	});
