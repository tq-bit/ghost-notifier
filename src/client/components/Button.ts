type ButtonOptions = {
	onClick: () => any;
};

export default class Button {
	buttonElement: HTMLButtonElement;

	constructor(buttonSelector: string, { onClick }: ButtonOptions) {
		this.buttonElement = document.querySelector(buttonSelector) as HTMLButtonElement;

		if (!this.buttonElement) {
			throw new Error(`Button selector ${buttonSelector} not found!`);
		}
		if (onClick) {
			this.handleClick(onClick);
		}
	}

	private handleClick(cb: () => any) {
		this.buttonElement.addEventListener('click', () => {
			cb();
		});
	}
}
