import Alert from '../components/Alert';
import Button from '../components/Button';
import Lifecycle from '../components/Lifecycle';

function main() {
	new Lifecycle({
		onPageReady: () => {
			const alert = new Alert('#domain-alert');
			new Button('#domain-hide-button', { onClick: () => alert.hide() });
			alert.setByUrl();
		},
	});
}

main();
