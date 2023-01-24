'use strict';

class Subscriber {
    constructor(eventSourceUrl, { statusTextElementSelector, statusIndicatorElementSelector }) {
        this.eventSource = new EventSource(eventSourceUrl);
        this.status = 'disconnected';
        this.statusTextElement = document.querySelector(statusTextElementSelector);
        this.statusIndicatorElement = document.querySelector(statusIndicatorElementSelector);
        if (!this.statusTextElement || !this.statusIndicatorElement) {
            console.warn('Subscriber: No status text or indicator found');
        }
        this.init();
    }
    init() {
        this.eventSource.addEventListener('open', () => {
            this.status = 'connected';
            this.statusTextElement.innerText = 'Connected';
            this.statusIndicatorElement.style.fill = 'green';
        });
        this.eventSource.addEventListener('close', () => {
            this.eventSource.close();
            this.status = 'disconnected';
            this.statusTextElement.innerText = 'Disconnected';
            this.statusIndicatorElement.style.fill = 'red';
        });
        this.eventSource.addEventListener('error', () => {
            this.eventSource.close();
            this.status = 'disconnected';
            this.statusTextElement.innerText = 'Error';
            this.statusIndicatorElement.style.fill = 'red';
        });
    }
    on(eventType, cb) {
        this.eventSource.addEventListener(eventType, (ev) => {
            cb(JSON.parse(ev.data));
        });
    }
    onError(cb) {
        this.eventSource.addEventListener('error', (err) => {
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
        this.tableBodyElement.append(row);
    }
}

class Notification {
    constructor(alertSelector) {
        this.notificationElement = document.querySelector(alertSelector);
        if (!this.notificationElement) {
            throw new Error(`Element with ID ${alertSelector} does not exist`);
        }
        this.message = this.notificationElement.querySelector('p');
        if (!this.message) {
            throw new Error('Alert has no header or text section');
        }
        this.notificationTypeMap = {
            success: 'is-success',
            error: 'is-danger',
            warning: 'is-warning',
        };
    }
    set({ type, text }) {
        this.notificationElement.classList.add(this.notificationTypeMap[type]);
        this.message.innerText = text;
        return this;
    }
    unset() {
        this.hide();
        for (let key in this.notificationTypeMap) {
            this.notificationElement.classList.remove(this.notificationTypeMap[key]);
        }
        return this;
    }
    show() {
        this.notificationElement.classList.remove('is-hidden');
    }
    hide() {
        this.notificationElement.classList.add('is-hidden');
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
}

const domainId = location.href.split('/')[4];
const notificationSubscriber = new Subscriber(`/api/domain/${domainId}/notifications/subscribe`, {
    statusTextElementSelector: '#connection-indicator-text',
    statusIndicatorElementSelector: '#connection-indicator-sign',
});
const notificationTable = new Table('#domain-notification-table-body');
const notificationCount = document.getElementById('domain-notification-count');
const connectionNotification = new Notification('#connection-notification');
new Button('#connection-notification-close', {
    onClick: () => connectionNotification.unset(),
});
function main() {
    new Lifecycle({
        onPageReady: () => {
            notificationSubscriber.on('insert', (notification) => {
                notificationTable.insertRow(notification, [
                    'ghostTitle',
                    'ghostOriginalUrl',
                    'ghostVisibility',
                    'type',
                ]);
                notificationCount.innerText = `${+notificationCount.innerText + 1}`;
                connectionNotification.set({ type: 'success', text: 'New notification received' }).show();
            });
        },
    });
}
main();
