import { Notification, NotificationEventType } from '../../@types';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export default class Subscriber {
	eventSource: EventSource;
	status: ConnectionStatus;
	constructor(eventSourceUrl: string) {
		this.eventSource = new EventSource(eventSourceUrl);
		this.status = 'disconnected';
		this.init();
	}

	init(): void {
		this.eventSource.addEventListener('open', () => {
			this.status = 'connected';
		});

		this.eventSource.addEventListener('close', () => {
			this.eventSource.close();
			this.status = 'disconnected';
		});
	}

	on(eventType: NotificationEventType, cb: (data: Notification) => any) {
		this.eventSource.addEventListener(eventType, (ev) => {
			cb(JSON.parse(ev.data));
		});
	}

	onError(cb: (err: unknown) => any) {
		this.eventSource.addEventListener('error', (err: unknown) => {
			console.error(err);
			cb(err);
		});
	}
}
