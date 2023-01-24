import { Notification, NotificationEventType } from '../../@types';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
type SubscriberIndicator = {
	statusTextElementSelector: string;
	statusIndicatorElementSelector: string;
};
export default class Subscriber {
	eventSource: EventSource;
	status: ConnectionStatus;
	statusTextElement: HTMLElement;
	statusIndicatorElement: HTMLElement;

	constructor(
		eventSourceUrl: string,
		{ statusTextElementSelector, statusIndicatorElementSelector }: SubscriberIndicator
	) {
		this.eventSource = new EventSource(eventSourceUrl);
		this.status = 'disconnected';
		this.statusTextElement = document.querySelector(statusTextElementSelector) as HTMLElement;
		this.statusIndicatorElement = document.querySelector(
			statusIndicatorElementSelector
		) as HTMLElement;

		if (!this.statusTextElement || !this.statusIndicatorElement) {
			console.warn('Subscriber: No status text or indicator found');
		}
		this.init();
	}

	init(): void {
		this.eventSource.addEventListener('open', () => {
			this.status = 'connected';
			this.statusTextElement.innerText = 'Connected';
			this.statusIndicatorElement.style.fill = 'green';
		});

		this.eventSource.addEventListener('close', () => {
			this.eventSource.close();
			this.status = 'disconnected';
			this.statusTextElement.innerText = 'Disconnected';
			this.statusIndicatorElement.style.fill = 'red';
		});

		this.eventSource.addEventListener('error', () => {
			this.eventSource.close();
			this.status = 'disconnected';
			this.statusTextElement.innerText = 'Error';
			this.statusIndicatorElement.style.fill = 'red';
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
