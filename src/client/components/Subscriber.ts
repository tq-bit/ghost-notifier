import { Notification, NotificationEventType } from '../../@types';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
export default class Subscriber {
	eventSource: EventSource | null;
	eventSourceUrl: string;
	status: ConnectionStatus;
	statusTextElement: HTMLElement;

	constructor(
		eventSourceUrl: string,
		{
			statusTextElementSelector,
		}: {
			statusTextElementSelector: string;
		}
	) {
		this.eventSource = null;
		this.eventSourceUrl = eventSourceUrl;
		this.status = 'disconnected';
		this.statusTextElement = document.querySelector(statusTextElementSelector) as HTMLElement;

		if (!this.statusTextElement) {
			console.warn('Subscriber: No status text pr indicator found');
		}
		this.init();
	}

	init(): void {
		this.eventSource = new EventSource(this.eventSourceUrl);

		this.eventSource.addEventListener('open', () => {
			this.status = 'connected';
			this.statusTextElement.innerText = 'Connected';

			this.statusTextElement.setAttribute('title', "You are connected to your domain's endpoint");
			this.statusTextElement.classList.add('is-success');
			this.statusTextElement.classList.remove('is-danger');
		});

		this.eventSource.addEventListener('close', () => {
			this.eventSource?.close();
			this.status = 'disconnected';
			this.statusTextElement.innerText = 'Disconnected';

			this.statusTextElement.setAttribute(
				'title',
				"You are disconnected from your domain's endpoint"
			);
			this.statusTextElement.classList.remove('is-success');
			this.statusTextElement.classList.add('is-danger');
		});

		this.eventSource.addEventListener('error', () => {
			this.eventSource?.close();
			this.status = 'disconnected';
			this.statusTextElement.innerText = 'Disconnected';

			this.statusTextElement.setAttribute(
				'title',
				"You are disconnected from your domain's endpoint"
			);

			this.statusTextElement.classList.remove('is-success');
			this.statusTextElement.classList.add('is-danger');
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
