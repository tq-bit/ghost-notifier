'use strict';

class Subscriber {
    constructor(eventSourceUrl, { statusTextElementSelector, }) {
        this.eventSource = null;
        this.eventSourceUrl = eventSourceUrl;
        this.status = 'disconnected';
        this.statusTextElement = document.querySelector(statusTextElementSelector);
        if (!this.statusTextElement) {
            console.warn('Subscriber: No status text pr indicator found');
        }
        this.init();
    }
    init() {
        this.eventSource = new EventSource(this.eventSourceUrl);
        this.eventSource.addEventListener('open', () => {
            this.status = 'connected';
            this.statusTextElement.innerText = 'Connected';
            this.statusTextElement.setAttribute('title', 'Your readers are able to receive realtime notifications from this domain');
            this.statusTextElement.classList.add('is-success');
            this.statusTextElement.classList.remove('is-danger');
        });
        this.eventSource.addEventListener('close', () => {
            var _a;
            (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.close();
            this.status = 'disconnected';
            this.statusTextElement.innerText = 'Disconnected';
            this.statusTextElement.setAttribute('title', 'Your readers cannot receive realtime notifications');
            this.statusTextElement.classList.remove('is-success');
            this.statusTextElement.classList.add('is-danger');
        });
        this.eventSource.addEventListener('error', () => {
            var _a;
            (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.close();
            this.status = 'disconnected';
            this.statusTextElement.innerText = 'Disconnected';
            this.statusTextElement.setAttribute('title', 'Your readers cannot receive realtime notifications');
            this.statusTextElement.classList.remove('is-success');
            this.statusTextElement.classList.add('is-danger');
        });
    }
    on(eventType, cb) {
        var _a;
        (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.addEventListener(eventType, (ev) => {
            cb(JSON.parse(ev.data));
        });
    }
    onError(cb) {
        var _a;
        (_a = this.eventSource) === null || _a === void 0 ? void 0 : _a.addEventListener('error', (err) => {
            console.error(err);
            cb(err);
        });
    }
}

class Lifecycle {
    constructor({ onDomReady, onPageReady, onPageUnload }) {
        this.isDomReady = false;
        this.isPageReady = false;
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
    handleDomReady(cb) {
        document.addEventListener('DOMContentLoaded', () => {
            cb();
            this.isDomReady = true;
        });
    }
    handlePageReady(cb) {
        window.onload = () => {
            cb();
            this.isPageReady = true;
        };
    }
    handlePageUnload(cb) {
        window.onbeforeunload = () => {
            cb();
        };
    }
}

class Table {
    constructor(tableBodySelector) {
        this.tableBodyElement = document.querySelector(tableBodySelector);
        if (!this.tableBodyElement) {
            throw new Error(`Table selector ${tableBodySelector} not found!`);
        }
    }
    insertRow(data, fields) {
        const row = document.createElement('tr');
        fields.forEach((field) => {
            for (let key in data) {
                if (field === key) {
                    const col = document.createElement('td');
                    col.innerText = data[key];
                    console.log(key, data[key]);
                    row.append(col);
                }
            }
        });
        this.tableBodyElement.prepend(row);
    }
}

class Button {
    constructor(buttonSelector, { onClick }) {
        this.buttonElement = document.querySelector(buttonSelector);
        if (!this.buttonElement) {
            throw new Error(`Button selector ${buttonSelector} not found!`);
        }
        if (onClick) {
            this.handleClick(onClick);
        }
    }
    handleClick(cb) {
        this.buttonElement.addEventListener('click', () => {
            cb();
        });
    }
    show() {
        this.buttonElement.classList.remove('is-hidden');
    }
    hide() {
        this.buttonElement.classList.add('is-hidden');
    }
}

class Alert {
    constructor(alertSelector) {
        this.alertElement = document.querySelector(alertSelector);
        if (!this.alertElement) {
            throw new Error(`Element with ID ${alertSelector} does not exist`);
        }
        this.title = this.alertElement.querySelector('.message-header p');
        this.message = this.alertElement.querySelector('.message-body p');
        if (!this.title || !this.message) {
            throw new Error('Alert has no header or text section');
        }
        this.alertTypeMap = {
            success: 'is-success',
            error: 'is-danger',
            warning: 'is-warning',
        };
    }
    setByUrl() {
        const query = new URLSearchParams(location.search);
        const status = query.get('status');
        if (!!status) {
            const message = query.get('message');
            const title = `${status.charAt(0).toUpperCase()}${status.substring(1, status.length)}!`;
            return this.set({ type: status, title: title, text: message }).show();
        }
    }
    set({ type, title, text }) {
        this.alertElement.classList.add(this.alertTypeMap[type]);
        this.title.innerText = title;
        this.message.innerText = text;
        return this;
    }
    unset() {
        this.hide();
        for (let key in this.alertTypeMap) {
            this.alertElement.classList.remove(this.alertTypeMap[key]);
        }
        return this;
    }
    show() {
        this.alertElement.classList.remove('is-hidden');
    }
    hide() {
        this.alertElement.classList.add('is-hidden');
    }
}

class Modal {
    constructor(modalSelector) {
        this.modalElement = document.querySelector(modalSelector);
        this.modalCloseButton = this.modalElement.querySelector('.modal-close');
        this.modalBackground = this.modalElement.querySelector('.modal-background');
        if (!this.modalElement) {
            throw new Error(`Modal selector ${modalSelector} not found!`);
        }
        if (!this.modalCloseButton) {
            throw new Error(`Modal selector ${modalSelector} has no close button with class 'modal-close'!`);
        }
        if (!this.modalBackground) {
            throw new Error(`Modal selector ${modalSelector} has no close button with class 'modal-close'!`);
        }
        this.registerOnClickCloseButton();
    }
    registerOnClickCloseButton() {
        this.modalCloseButton.addEventListener('click', () => this.hide());
        this.modalBackground.addEventListener('click', () => this.hide());
    }
    show() {
        this.modalElement.classList.add('is-active');
    }
    hide() {
        this.modalElement.classList.remove('is-active');
    }
}

class Panel {
    constructor(panelElementSelector) {
        this.panelElement = document.querySelector(panelElementSelector);
        this.init();
    }
    init() {
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
                tabBlockItem === null || tabBlockItem === void 0 ? void 0 : tabBlockItem.classList.remove('is-hidden');
            });
        });
    }
}

new Panel('#connection-panel');
const domainId = location.href.split('/')[4];
/**
 * Elements for domain and notification info
 * - Header info bar elements
 * - Notification table
 */
const notificationCount = document.getElementById('domain-notification-count');
const notificationTable = new Table('#domain-notification-table-body');
/**
 * Elements for the connection card
 * - Subsciber
 * - Domain action buttons
 * - Modal Element
 */
const notificationSubscriber = new Subscriber(`/api/domain/${domainId}/notifications/subscribe`, {
    statusTextElementSelector: '#connection-indicator-text',
});
const connectionControlButton = new Button('#connection-control-button', {
    onClick: () => {
        connectionControlButton.hide();
        notificationSubscriber.init();
        notificationSubscriber.on('insert', handleInsertNotification);
    },
});
const connectionModal = new Modal('#domain-notification-modal');
const webhookModal = new Modal('#webhook-creation-modal');
new Button('#connection-modal-button', {
    onClick: () => connectionModal.show(),
});
new Button('#webhook-modal-button', {
    onClick: () => webhookModal.show(),
});
/**
 * Other elements
 * - Alert
 */
const appAlert = new Alert('#app-alert');
new Button('#app-alert-hide-button', {
    onClick: () => appAlert.unset(),
});
/**
 * Custom functions & main function
 */
function handleInsertNotification(notification) {
    notificationTable.insertRow(notification, [
        'ghostTitle',
        'ghostOriginalUrl',
        'ghostVisibility',
        'type',
        'created',
    ]);
    notificationCount.innerText = `${+notificationCount.innerText + 1}`;
    appAlert.set({ type: 'success', title: 'Success', text: 'New notification received' }).show();
}
function main() {
    new Lifecycle({
        onPageReady: () => {
            appAlert.setByUrl();
            notificationSubscriber.on('insert', handleInsertNotification);
            notificationSubscriber.onError((err) => {
                connectionControlButton.show();
            });
        },
    });
}
main();
