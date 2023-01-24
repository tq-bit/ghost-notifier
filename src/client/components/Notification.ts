type AlertType = 'success' | 'error' | 'warning';

type AlertOptions = {
	type: AlertType;
	text: string;
};

export default class Notification {
	notificationElement: HTMLElement;
	notificationTypeMap: Record<string, string>;

	message: HTMLElement;

	constructor(alertSelector: string) {
		this.notificationElement = document.querySelector(alertSelector) as HTMLElement;

		if (!this.notificationElement) {
			throw new Error(`Element with ID ${alertSelector} does not exist`);
		}

		this.message = this.notificationElement.querySelector('p') as HTMLElement;

		if (!this.message) {
			throw new Error('Alert has no header or text section');
		}
		this.notificationTypeMap = {
			success: 'is-success',
			error: 'is-danger',
			warning: 'is-warning',
		};
	}

	public set({ type, text }: AlertOptions) {
		this.notificationElement.classList.add(this.notificationTypeMap[type]);
		this.message.innerText = text;
		return this;
	}

	public unset() {
		this.hide();
		for (let key in this.notificationTypeMap) {
			this.notificationElement.classList.remove(this.notificationTypeMap[key]);
		}
		return this;
	}

	public show() {
		this.notificationElement.classList.remove('is-hidden');
	}

	public hide() {
		this.notificationElement.classList.add('is-hidden');
	}
}
