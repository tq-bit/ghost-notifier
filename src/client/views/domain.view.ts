import Alert from '../components/Alert';
import Lifecycle from '../components/Lifecycle';

function main() {
	new Lifecycle({
		onPageReady: () => {
			const alert = new Alert('#domain-alert');
			alert.setByUrl();
		},
	});
}

main();
