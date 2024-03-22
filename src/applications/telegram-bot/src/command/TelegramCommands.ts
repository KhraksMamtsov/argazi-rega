interface TelegramCommand<C extends string> {
  readonly command: C;
  readonly description: string;
}

const telegramCommand = <const C extends string>(options: {
  readonly command: C;
  readonly description: string;
}): TelegramCommand<C> => options;

export const Start = telegramCommand({
  command: "start",
  description: "Начать",
});
export const Login = telegramCommand({
  command: "login",
  description: "Войти",
});
export const Logout = telegramCommand({
  command: "logout",
  description: "Выйти",
});

export const Places = telegramCommand({
  command: "places",
  description: "Места",
});

export const Me = telegramCommand({ command: "me", description: "Обо мне" });
export const MyEvents = telegramCommand({
  command: "myevents",
  description: "Мои события",
});

export const TelegramCommands = [
  Start,
  Login,
  Logout,
  Places,
  Me,
  MyEvents,
] as const satisfies ReadonlyArray<TelegramCommand<string>>;
