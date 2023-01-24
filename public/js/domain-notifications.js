'use strict';

class Subscriber {
    constructor(eventSourceUrl) {
        this.eventSource = new EventSource(eventSourceUrl);
        this.status = 'disconnected';
        this.init();
    }
    init() {
        this.eventSource.addEventListener('open', () => {
            this.status = 'connected';
        });
        this.eventSource.addEventListener('close', () => {
            this.eventSource.close();
            this.status = 'disconnected';
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

const notificationSubscriber = new Subscriber('/api/notification/subscribe');
const notificationTable = new Table('#domain-notification-table-body');
const notificationCount = document.getElementById('domain-notification-count');
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
            });
        },
    });
}
main();
