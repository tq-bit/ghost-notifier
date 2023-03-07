import { GN_COOKIE_NAME } from '../../constants';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export default {
  toggleElementsByUserSessionState() {
    const activeElementsInSession = document.querySelectorAll(
      '[data-user-session="active"]',
    );
    const activeElementsOutSession = document.querySelectorAll(
      '[data-user-session="inactive"]',
    );

    const userToken = getCookie(GN_COOKIE_NAME);

    console.log(userToken);

    if (userToken) {
      activeElementsOutSession.forEach((element) => element.remove());
    } else {
      activeElementsInSession.forEach((element) => element.remove());
    }
  },
};
