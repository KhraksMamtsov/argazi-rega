import { Redacted, Effect } from "effect";

import type { Event } from "@argazi/domain";

import { DateMdComponent } from "./Date.md-component.js";
import { MD } from "./Markdown.js";
import { MoneyMdComponent } from "./Money.md-component.js";

export const EventMdComponent = (props: { event: Event }) =>
  Effect.gen(function* (_) {
    const { event } = props;

    const headline = MD.line(
      "📅 Событие: ",
      MD.pipe(Redacted.value(event.name), MD.escape, MD.bold)
    );

    return yield* MD.document(
      MD.headline(headline),

      MD.dl()(
        ["Дедлайн", MD.bold(DateMdComponent({ date: event.dateDeadline }))],
        ["Начало", MD.bold(DateMdComponent({ date: event.dateStart }))],
        ["Окончание", MD.bold(DateMdComponent({ date: event.dateFinish }))],
        ["Цена за день", MD.bold(MoneyMdComponent({ money: event.priceDay }))],
        [
          "Цена за событие",
          MD.bold(MoneyMdComponent({ money: event.priceEvent })),
        ]
      )
    );
  });
