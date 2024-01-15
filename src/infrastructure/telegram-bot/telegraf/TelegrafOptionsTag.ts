import { Context, Layer } from "effect";
import * as _Telegraf from "telegraf";

type TelegrafCtorParams = ConstructorParameters<typeof _Telegraf.Telegraf>;
export type _TelegrafOptions = Exclude<TelegrafCtorParams[1], undefined>;
export type TelegrafToken = TelegrafCtorParams[0];

export type TelegrafOptions = _TelegrafOptions;

export class TelegrafOptionsTag extends Context.Tag(
	"@telegraf/TelegrafOptions"
)<TelegrafOptionsTag, TelegrafOptions>() {
	public static readonly Live = (options: TelegrafOptions) =>
		Layer.succeed(this, this.of(options));
}
