import { Effect, BigDecimal } from "effect";

import type { Money } from "@argazi/domain";

import { MD } from "./Markdown.js";

export const MoneyMdComponent = (props: { money: Money }) =>
  Effect.gen(function* () {
    const { money } = props;

    return MD.escape(
      new Intl.NumberFormat("ru-RU", {
        currency: "RUB",
        style: "currency",
      }).format(BigDecimal.unsafeToNumber(money))
    );
  });
