import { Effect, BigDecimal } from "effect";

import { MD } from "./Markdown.js";

import type { Money } from "../../../domain/value-objects/Money.js";

export const MoneyMdComponent = (props: { money: Money }) =>
	Effect.gen(function* (_) {
		const { money } = props;

		return MD.escape(
			new Intl.NumberFormat("ru-RU", {
				currency: "RUB",
				style: "currency",
			}).format(BigDecimal.unsafeToNumber(money)) // + " 💰"
		);
	});
