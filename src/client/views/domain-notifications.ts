import Subscriber from '../components/Subscriber';
import Lifecycle from '../components/Lifecycle';
import Table from '../components/Table';

const notificationSubscriber = new Subscriber('/api/notification/subscribe', {
	statusTextElementSelector: '#connection-indicator-text',
	statusIndicatorElementSelector: '#connection-indicator-sign',
});
const notificationTable = new Table('#domain-notification-table-body');
const notificationCount = document.getElementById('domain-notification-count') as HTMLElement;

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
