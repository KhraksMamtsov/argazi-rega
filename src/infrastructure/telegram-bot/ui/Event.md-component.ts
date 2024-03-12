import { Secret, Effect } from "effect";

import { DateMdComponent } from "./Date.md-component.js";
import { MD } from "./Markdown.js";
import { MoneyMdComponent } from "./Money.md-component.js";

import type { Event } from "../../../domain/event/entity/Event.js";

const CommonEventInfo = (props: { event: Event }) =>
	Effect.gen(function* (_) {
		const { event } = props;

		return yield* _(
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

export const EventMdComponent = (props: { event: Event }) =>
	Effect.gen(function* (_) {
		const { event } = props;

		return yield* _(
			MD.document(
				MD.headline(MD.pipe(Secret.value(event.name), MD.escape, MD.bold)),
				MD.br,
				CommonEventInfo({ event })
			)
		);
	});

export const EventInfoMdComponent = (props: { event: Event }) =>
	Effect.gen(function* (_) {
		const { event } = props;

		return yield* _(
			MD.document(
				MD.dl()([
					MD.underline("Событие"),
					MD.pipe(Secret.value(event.name), MD.escape, MD.bold),
				]),
				CommonEventInfo({ event })
			)
		);
	});
