import { Notification, NotificationEventType } from '../../@types';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
export default class Subscriber {
	eventSource: EventSource | null;
	eventSourceUrl: string;
	status: ConnectionStatus;
	statusTextElement: HTMLElement;
	statusIndicatorElement: HTMLElement;

	constructor(
		eventSourceUrl: string,
		{
			statusTextElementSelector,
			statusIndicatorElementSelector,
		}: {
			statusTextElementSelector: string;
			statusIndicatorElementSelector: string;
		}
	) {
		this.eventSource = null;
		this.eventSourceUrl = eventSourceUrl;
		this.status = 'disconnected';
		this.statusTextElement = document.querySelector(statusTextElementSelector) as HTMLElement;
		this.statusIndicatorElement = document.querySelector(
			statusIndicatorElementSelector
		) as HTMLElement;

		if (!this.statusTextElement || !this.statusIndicatorElement) {
			console.warn('Subscriber: No status text pr indicator found');
		}
		this.init();
	}

	init(): void {
		this.eventSource = new EventSource(this.eventSourceUrl);

		this.eventSource.addEventListener('open', () => {
			this.status = 'connected';
			this.statusTextElement.innerText = 'Connected to domain subscription endpoint';
			this.statusIndicatorElement.style.fill = 'green';
		});

		this.eventSource.addEventListener('close', () => {
			this.eventSource?.close();
			this.status = 'disconnected';
			this.statusTextElement.innerText = 'Disconnected from domain subscription endpoint';
			this.statusIndicatorElement.style.fill = 'orange';
		});

		this.eventSource.addEventListener('error', () => {
			this.eventSource?.close();
			this.status = 'disconnected';
			this.statusTextElement.innerText =
				'An error occured while connecting, please check the server logs';
			this.statusIndicatorElement.style.fill = 'red';
		});
	}

	on(eventType: NotificationEventType, cb: (data: Notification) => any) {
		this.eventSource?.addEventListener(eventType, (ev) => {
			cb(JSON.parse(ev.data));
		});
	}

	onError(cb: (err: unknown) => any) {
		this.eventSource?.addEventListener('error', (err: unknown) => {
			console.error(err);
			cb(err);
		});
	}
}
