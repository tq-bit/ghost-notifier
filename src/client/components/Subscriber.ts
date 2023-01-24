import { Notification } from '../../@types';

const logList = document.querySelector('#log-list');
const logListPlaceholder = document.querySelector('#log-list-placeholder');

const connectionIndicatorSign: HTMLElement =
	document.querySelector('#connection-indicator-sign') || new HTMLElement();

const connectionIndicatorText: HTMLElement =
	document.querySelector('#connection-indicator-text') || new HTMLElement();

const connectionIndicatorButton: HTMLElement =
	document.querySelector('#connection-indicator-button') || new HTMLElement();

function _removePlaceholder() {
	if (logListPlaceholder) {
		logListPlaceholder.remove();
	}
}

function _updateConnectionStatus(status: 'disconnected' | 'connecting' | 'connected') {
	if (status === 'connected') {
		connectionIndicatorSign.style.fill = 'green';
		connectionIndicatorText.innerText = 'Connected';
		connectionIndicatorButton.classList.add('d-none');
	}
	if (status === 'connecting') {
		connectionIndicatorSign.style.fill = 'orange';
		connectionIndicatorText.innerText = 'Connecting ...';
	}
	if (status === 'disconnected') {
		connectionIndicatorSign.style.fill = 'red';
		connectionIndicatorText.innerText = 'Disconnected';
		connectionIndicatorButton.classList.remove('d-none');
	}
}

function renderListElement(sseMessage: MessageEvent): HTMLElement {
	const li = document.createElement('li');
	const title = document.createElement('h4');
	const text = document.createElement('p');
	const link = document.createElement('a');
	const tag = document.createElement('span');

	const ghostNotification: Notification = JSON.parse(sseMessage.data);

	li.classList.add('list-group-item');
	li.dataset.postId = ghostNotification.ghostId;

	title.textContent = `${new Date().toLocaleTimeString()} - Operation Type: ${sseMessage.type}`;

	text.textContent = ghostNotification.ghostTitle;
	text.classList.add('mb-0');

	link.href = ghostNotification.ghostOriginalUrl;
	link.target = '_blank';
	link.innerText = 'Show article';
	link.classList.add('d-block');

	tag.classList.add('badge', 'bg-info', 'mb-2');
	tag.innerText = ghostNotification.ghostPrimaryTag;

	li.append(title);
	li.append(text);
	li.append(tag);
	li.append(link);
	return li;
}

function initEventSource() {
	const subscription = new EventSource('/api/notification/subscribe');

	// @ts-ignore
	subscription.addEventListener('open', (ev: MessageEvent): any => {
		_updateConnectionStatus('connected');
	});

	subscription.addEventListener('error', () => {
		_updateConnectionStatus('disconnected');
		subscription.close();
	});

	subscription.addEventListener('message', (ev: MessageEvent) => {
		_removePlaceholder();
		logList?.prepend(renderListElement(ev));
	});

	window.addEventListener('close', () => subscription.close());
}

function initUiButtons() {
	connectionIndicatorButton.addEventListener('click', () => initEventSource());
}

function main() {
	initEventSource();
	initUiButtons();
}

window.onload = () => main();
