export default class Panel {
	panelElement: HTMLElement;
	constructor(panelElementSelector: string) {
		this.panelElement = document.querySelector(panelElementSelector) as HTMLElement;
		this.init();
	}

	private init() {
		const tabNavItems = this.panelElement.querySelectorAll('[data-panel-tab]');
		const tabBlockItems = this.panelElement.querySelectorAll('[data-panel-tab-item]');

		if (tabNavItems.length !== tabBlockItems.length) {
			console.warn('Tabs and its items do not have the same length!');
		}

		tabNavItems.forEach((tabNavItem) => {
			tabNavItem.addEventListener('click', () => {
				const tabId = tabNavItem.getAttribute('data-panel-tab');
				const tabBlockItem = this.panelElement.querySelector(`[data-panel-tab-item="${tabId}"]`);

				tabNavItems.forEach((tab) => tab.classList.remove('is-active'));
				tabBlockItems.forEach((tab) => tab.classList.add('is-hidden'));

				tabNavItem.classList.add('is-active');
				tabBlockItem?.classList.remove('is-hidden');
			});
		});
	}
}
