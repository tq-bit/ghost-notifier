import { Notification, NotificationEventType } from '../../@types';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
type SubscriberIndicator = {
	statusTextElementSelector: string;
	statusIndicatorElementSelector: string;
	connectionControlButtonSelector: string;
};
export default class Subscriber {
	eventSource: EventSource | null;
	eventSourceUrl: string;
	status: ConnectionStatus;
	statusTextElement: HTMLElement;
	statusIndicatorElement: HTMLElement;
	connectionControlButton: HTMLElement;

	constructor(
		eventSourceUrl: string,
		{
			statusTextElementSelector,
			statusIndicatorElementSelector,
			connectionControlButtonSelector,
		}: SubscriberIndicator
	) {
		this.eventSource = null;
		this.eventSourceUrl = eventSourceUrl;
		this.status = 'disconnected';
		this.statusTextElement = document.querySelector(statusTextElementSelector) as HTMLElement;
		this.statusIndicatorElement = document.querySelector(
			statusIndicatorElementSelector
		) as HTMLElement;
		this.connectionControlButton = document.querySelector(
			connectionControlButtonSelector
		) as HTMLElement;

		if (!this.statusTextElement || !this.statusIndicatorElement || !this.connectionControlButton) {
			console.warn('Subscriber: No status text, indicator or reconnect button found');
		}
		this.init();
	}

	init(): void {
		this.eventSource = new EventSource(this.eventSourceUrl);

		this.eventSource.addEventListener('open', () => {
			this.status = 'connected';
			this.connectionControlButton.classList.add('is-hidden');
			this.statusTextElement.innerText = 'Connected to domain subscription endpoint';
			this.statusIndicatorElement.style.fill = 'green';
		});

		this.eventSource.addEventListener('close', () => {
			this.eventSource?.close();
			this.connectionControlButton.classList.remove('is-hidden');
			this.status = 'disconnected';
			this.statusTextElement.innerText = 'Disconnected from domain subscription endpoint';
			this.statusIndicatorElement.style.fill = 'orange';
		});

		this.eventSource.addEventListener('error', () => {
			this.eventSource?.close();
			this.connectionControlButton.classList.remove('is-hidden');
			this.status = 'disconnected';
			this.statusTextElement.innerText =
				'An error occured while connecting, please check the server logs';
			this.statusIndicatorElement.style.fill = 'red';
		});

		this.connectionControlButton.addEventListener('click', () => this.init());
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
