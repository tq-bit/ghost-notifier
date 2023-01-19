'use strict';

const logList = document.querySelector('#log-list');
const logListPlaceholder = document.querySelector('#log-list-placeholder');
const connectionIndicatorSign = document.querySelector('#connection-indicator-sign') || new HTMLElement();
const connectionIndicatorText = document.querySelector('#connection-indicator-text') || new HTMLElement();
const connectionIndicatorButton = document.querySelector('#connection-indicator-button') || new HTMLElement();
function _removePlaceholder() {
    if (logListPlaceholder) {
        logListPlaceholder.remove();
    }
}
function _updateConnectionStatus(status) {
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
function renderListElement(sseMessage) {
    const li = document.createElement('li');
    const title = document.createElement('h4');
    const text = document.createElement('p');
    const link = document.createElement('a');
    const tag = document.createElement('span');
    const ghostNotification = JSON.parse(sseMessage.data);
    li.classList.add('list-group-item');
    li.dataset.postId = ghostNotification.postId;
    title.textContent = `${new Date().toLocaleTimeString()} - Operation Type: ${sseMessage.type}`;
    text.textContent = ghostNotification.postTitle;
    text.classList.add('mb-0');
    link.href = ghostNotification.postOriginalUrl;
    link.target = '_blank';
    link.innerText = 'Show article';
    link.classList.add('d-block');
    tag.classList.add('badge', 'bg-info', 'mb-2');
    tag.innerText = ghostNotification.postPrimaryTag;
    li.append(title);
    li.append(text);
    li.append(tag);
    li.append(link);
    return li;
}
function initEventSource() {
    const subscription = new EventSource('/api/subscribe/notification');
    // @ts-ignore
    subscription.addEventListener('open', (ev) => {
        _updateConnectionStatus('connected');
    });
    subscription.addEventListener('error', () => {
        _updateConnectionStatus('disconnected');
        subscription.close();
    });
    subscription.addEventListener('message', (ev) => {
        _removePlaceholder();
        logList === null || logList === void 0 ? void 0 : logList.prepend(renderListElement(ev));
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
