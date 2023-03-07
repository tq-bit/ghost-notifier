import Alert from '../components/Alert';
import Button from '../components/Button';
import Lifecycle from '../components/Lifecycle';

function main() {
  new Lifecycle({
    onPageReady: () => {
      const alert = new Alert('#app-alert');
      new Button('#app-alert-hide-button', { onClick: () => alert.hide() });
      alert.setByUrl();
    },
  });
}

main();
