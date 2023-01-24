import Subscriber from '../components/Subscriber';
import Lifecycle from '../components/Lifecycle';
import Table from '../components/Table';
import Notification from '../components/Notification';
import Button from '../components/Button';

const notificationSubscriber = new Subscriber('/api/notification/subscribe', {
	statusTextElementSelector: '#connection-indicator-text',
	statusIndicatorElementSelector: '#connection-indicator-sign',
});
const notificationTable = new Table('#domain-notification-table-body');
const notificationCount = document.getElementById('domain-notification-count') as HTMLElement;

const connectionNotification = new Notification('#connection-notification');
const connectionNotificationButton = new Button('#connection-notification-close', {
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
