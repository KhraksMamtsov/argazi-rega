import { Stream, Effect } from "effect";

import * as Notification from "../notification/Notification.js";

import type { Simplify } from "../../libs/Typescript.js";

export interface NotificationService {
	readonly queue: (
		notification: Notification.Notification
	) => Effect.Effect<boolean>;
	readonly stream$: Stream.Stream<NotificationMessage>;
}

export class NotificationServiceTag extends Effect.Tag(
	"@argazi/domain/NotificationService"
)<NotificationServiceTag, NotificationService>() {}

export interface NotificationMessage {
	readonly _tag: "NotificationMessage";
	readonly ack: (allUpTo?: boolean) => Effect.Effect<void>;
	readonly notification: Notification.Notification;
}

export type NotificationMessageWithIssueForEntity<
	I extends Notification.NotificationIssue,
	ET extends Notification.NotificationEntity["type"],
> = Simplify<
	NotificationMessage & {
		readonly notification: Notification.NotificationWithEntity<
			ET,
			Notification.NotificationWithIssue<I>
		>;
	}
>;
