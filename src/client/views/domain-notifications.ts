import { Notification } from '../../@types';
import Subscriber from '../components/Subscriber';
import Lifecycle from '../components/Lifecycle';
import Table from '../components/Table';
import Button from '../components/Button';
import Alert from '../components/Alert';

const domainId = location.href.split('/')[4];

const notificationSubscriber = new Subscriber(`/api/domain/${domainId}/notifications/subscribe`, {
	statusTextElementSelector: '#connection-indicator-text',
	statusIndicatorElementSelector: '#connection-indicator-sign',
	connectionControlButtonSelector: '#connection-control-button',
});
const notificationTable = new Table('#domain-notification-table-body');
const notificationCount = document.getElementById('domain-notification-count') as HTMLElement;

const connectionAlert = new Alert('#connection-alert');
const connectionAlertButton = new Button('#connection-alert-button', {
	onClick: () => connectionAlert.unset(),
});

function handleInsertNotification(notification: Notification) {
	console.log(notification);
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
		},
	});
}

main();
