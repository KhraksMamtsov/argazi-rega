import { Effect, Record } from "effect";

import { VisitorType } from "@argazi/domain";

import { MD } from "./Markdown.js";

const visitorTypeToString: Record.ReadonlyRecord<VisitorType, string> = {
  [VisitorType.ADULT]: "Взрослый",
  [VisitorType.PENSIONER]: "Пенсионер",
  [VisitorType.STUDENT]: "Студент",
  [VisitorType.CHILD]: "Ребенок",
};

export const VisitorTypeMdComponent = (props: { visitorType: VisitorType }) =>
  Effect.gen(function* () {
    const { visitorType } = props;

    return MD.escape(visitorTypeToString[visitorType]);
  });
