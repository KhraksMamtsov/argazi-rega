import { Effect, Redacted, Option, pipe } from "effect";

import type { User } from "@argazi/domain";

import { EmptyMdComponent } from "./Empty.md-component.js";
import { MD } from "./Markdown.js";
import { UserTypeMdComponent } from "./UserType.md-component.js";

export const UserMdComponent = (props: { user: User }) =>
  Effect.gen(function* () {
    const { user } = props;

    return yield* MD.document(
      MD.headline("🧘 Пользователь"),
      MD.dl()(
        [
          "Имя",
          pipe(
            //
            user.firstName,
            Redacted.value,
            MD.escape,
            MD.bold
          ),
        ],
        [
          "Фамилия",
          pipe(
            user.lastName,
            Option.match({
              onNone: () => EmptyMdComponent({ length: 4 }),
              onSome: Redacted.value,
            }),
            MD.escape,
            MD.bold
          ),
        ],
        ["Email", pipe(user.email, Redacted.value, MD.escape, MD.bold)],
        [
          "Телефон",
          pipe(
            user.phone,
            Option.match({
              onNone: () => EmptyMdComponent({ length: 4 }),
              onSome: Redacted.value,
            }),
            MD.escape,
            MD.bold
          ),
        ],
        ["Тип", MD.bold(UserTypeMdComponent({ userType: user.type }))]
      )
    );
  });
