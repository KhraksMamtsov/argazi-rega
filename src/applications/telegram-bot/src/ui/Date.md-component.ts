import { Effect } from "effect";

// import { CLOCK_FACES } from "./CLOCK_FACES.js";
import { MD } from "./Markdown.js";

// function dateToClockFace(date: Date) {
// 	const hour = date.getHours();
// 	const minutes = date.getMinutes();

// 	return CLOCK_FACES.find((element) =>
// 		element.time.find((time) => {
// 			const minute = time[1];

// 			return (
// 				((minute === 30 && minutes >= 15 && minutes <= 45) ||
// 					(minute === 0 && (minutes < 15 || minutes > 45))) &&
// 				hour === time[0]
// 			);
// 		})
// 	)?.face;
// }

export interface DateMdComponentProps {
  readonly date: Date;
  readonly options?: ConstructorParameters<typeof Intl.DateTimeFormat>[1];
}

export const DateMdComponent = (props: DateMdComponentProps) =>
  Effect.gen(function* () {
    const { date, options } = props;
    // const clockFace = dateToClockFace(date);

    return MD.escape(
      new Intl.DateTimeFormat(
        "ru-RU",
        options ?? {
          dateStyle: "short",
          timeStyle: "short",
        }
      ).format(date) // + (clockFace ? ` ${clockFace}` : "")
    );
  });
