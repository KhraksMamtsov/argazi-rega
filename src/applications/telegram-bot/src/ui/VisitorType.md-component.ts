import { Effect, ReadonlyRecord } from "effect";

import { VisitorType } from "@argazi/domain";

import { MD } from "./Markdown.js";

const visitorTypeToString: ReadonlyRecord.ReadonlyRecord<VisitorType, string> =
  {
    [VisitorType.ADULT]: "Взрослый",
    [VisitorType.PENSIONER]: "Пенсионер",
    [VisitorType.STUDENT]: "Студент",
    [VisitorType.CHILD]: "Ребенок",
  };

export const VisitorTypeMdComponent = (props: { visitorType: VisitorType }) =>
  Effect.gen(function* (_) {
    const { visitorType } = props;

    return MD.escape(visitorTypeToString[visitorType]);
  });
