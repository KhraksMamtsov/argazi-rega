import { Config, Effect, Layer, Secret } from "effect";
// import * as Tg from "telegraf";

export interface TelegrafOptions {
	// readonly client: Partial<Tg.Telegraf.Options<Tg.Context>>;
	// readonly launch: Tg.Telegraf.LaunchOptions;
	readonly token: Secret.Secret;
}

export class TelegrafOptionsTag extends Effect.Tag("TelegrafOptionsTag")<
	TelegrafOptionsTag,
	TelegrafOptions
>() {
	static layerConfig = (config: Config.Config.Wrap<TelegrafOptions>) =>
		Layer.effect(this, Config.unwrap(config));
}
