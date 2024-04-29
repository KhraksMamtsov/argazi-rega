import { Effect, Option } from "effect";

import type { Visitor } from "@argazi/domain";

import { EmptyMdComponent } from "./Empty.md-component.js";
import { MD } from "./Markdown.js";
import { VisitorTypeMdComponent } from "./VisitorType.md-component.js";

export const VisitorMdComponent = (props: { visitor: Visitor }) =>
  Effect.gen(function* (_) {
    const { visitor } = props;

    const headline = MD.line(
      "👤 Посетитель: ",
      MD.pipe(visitor.name, MD.escape, MD.bold)
    );

    return yield* MD.document(
      MD.headline(headline),
      MD.dl()(
        ["Тип", MD.bold(VisitorTypeMdComponent({ visitorType: visitor.type }))],
        [
          "Email",
          MD.bold(
            Option.getOrElse(visitor.email, () =>
              EmptyMdComponent({ length: 4 })
            )
          ),
        ]
      )
    );
  });
