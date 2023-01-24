import Subscriber from '../components/Subscriber';
import Lifecycle from '../components/Lifecycle';
import Table from '../components/Table';

const notificationSubscriber = new Subscriber('/api/notification/subscribe');
const notificationTalbe = new Table('#domain-notification-table-body');

function main() {
	new Lifecycle({
		onPageReady: () => {
			notificationSubscriber.on('insert', (notification) => {
				notificationTalbe.insertRow(notification, [
					'ghostTitle',
					'ghostOriginalUrl',
					'ghostVisiblity',
					'type',
				]);
			});
		},
	});
}

main();
