type LifecycleOptions = {
	onDomReady?: () => any;
	onPageReady?: () => any;
	onPageUnload?: () => any;
};

export default class Lifecycle {
	isDomReady: boolean = false;
	isPageReady: boolean = false;

	constructor({ onDomReady, onPageReady, onPageUnload }: LifecycleOptions) {
		if (onDomReady) {
			this.handleDomReady(onDomReady);
		}

		if (onPageReady) {
			this.handlePageReady(onPageReady);
		}

		if (onPageUnload) {
			this.handlePageUnload(onPageUnload);
		}
	}

	private handleDomReady(cb: () => any) {
		document.addEventListener('DOMContentLoaded', () => {
			cb();
			this.isDomReady = true;
		});
	}

	private handlePageReady(cb: () => any) {
		window.onload = () => {
			cb();
			this.isPageReady = true;
		};
	}

	private handlePageUnload(cb: () => any) {
		window.onbeforeunload = () => {
			cb();
		};
	}
}
