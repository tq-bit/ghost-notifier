'use strict';

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

function main() {
    new Lifecycle({
        onPageReady: () => {
            const alert = new Alert('#domain-alert');
            alert.setByUrl();
        },
    });
}
main();
