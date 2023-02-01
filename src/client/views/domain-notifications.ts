import { Notification } from '../../@types';
import Subscriber from '../components/Subscriber';
import Lifecycle from '../components/Lifecycle';
import Table from '../components/Table';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import Panel from '../components/Panel';

const panel = new Panel('#connection-panel');

console.log(panel);

const domainId = location.href.split('/')[4];

/**
 * Elements for domain and notification info
 * - Header info bar elements
 * - Notification table
 */

const notificationCount = document.getElementById('domain-notification-count') as HTMLElement;
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
const openConnectionModalButton = new Button('#connection-modal-button', {
	onClick: () => connectionModal.show(),
});

/**
 * Other elements
 * - Alert
 */

const connectionAlert = new Alert('#connection-alert');
const connectionAlertButton = new Button('#connection-alert-button', {
	onClick: () => connectionAlert.unset(),
});

/**
 * Custom functions & main function
 */

function handleInsertNotification(notification: Notification) {
	notificationTable.insertRow(notification, [
		'ghostTitle',
		'ghostOriginalUrl',
		'ghostVisibility',
		'type',
		'created',
	]);
	notificationCount.innerText = `${+notificationCount.innerText + 1}`;
	connectionAlert
		.set({ type: 'success', title: 'Success', text: 'New notification received' })
		.show();
}

function main() {
	new Lifecycle({
		onPageReady: () => {
			connectionAlert.setByUrl();
			notificationSubscriber.on('insert', handleInsertNotification);
			notificationSubscriber.onError((err) => {
				connectionControlButton.show();
			});
		},
	});
}

main();
