/**
 *  @typedef  GhostNotification
 *  @property {string}  postId;
 *  @property {string}  postTitle;
 *  @property	{string}  postVisibility;
 *  @property	{string}  ghostOriginalUrl;
 *  @property	{string}  postPrimaryTag;
 *  @property {'post-published' | 'post-updated'} type
 */

const NOTIFICATION_URL = 'http://localhost:3000/api/notification/subscribe';
const NOTIFICATION_BUTTON_ID = 'notification-button';
const NOTIFICATION_DROPDOWN_ID = 'notification-dropdown';
const NOTIFICATION_LIST_ID = 'notification-list';
const NOTIFICATION_BADGE_ID = 'notification-badge';
const subscription = new EventSource(NOTIFICATION_URL);

function toggleNotificationDropdown() {
  const notificationBadge = document.getElementById(NOTIFICATION_BADGE_ID);
  const notificationDropdown = document.getElementById(
    NOTIFICATION_DROPDOWN_ID,
  );

  if (notificationDropdown) {
    if (notificationDropdown.tabIndex === 1) {
      notificationDropdown.tabIndex = -1;
      notificationDropdown.style.maxHeight = '0px';
      notificationDropdown.style.overflowY = 'hidden';
    } else {
      notificationBadge?.classList.add('hidden');
      notificationDropdown.tabIndex = 1;
      notificationDropdown.style.maxHeight = '400px';
      setTimeout(() => (notificationDropdown.style.overflowY = 'auto'), 1000);
    }
  }
}

function renderNotificationUi() {
  const notificationElement = document.createElement('div');
  notificationElement.classList.add('notification_wrapper');
  const notificationButton = renderNotificationButton();
  const notificationDropdown = renderNotificationDropdown();

  notificationButton.addEventListener('click', toggleNotificationDropdown);

  notificationElement.append(notificationButton);
  notificationElement.append(notificationDropdown);
  return notificationElement;
}

function renderNotificationBadge() {
  const notificationBadge = document.createElement('div');
  notificationBadge.id = NOTIFICATION_BADGE_ID;
  notificationBadge.classList.add('notification_badge', 'hidden');

  return notificationBadge;
}

function renderNotificationIcon() {
  const notificationIcon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );
  notificationIcon.classList.add('icon');
  notificationIcon.setAttribute('viewBox', '0 0 24 24');
  notificationIcon.setAttribute('width', '20');
  notificationIcon.setAttribute('stroke', 'currentColor');
  notificationIcon.setAttribute('stroke-width', '0.5');
  notificationIcon.setAttribute('fill', 'currentColor');

  const iconPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  iconPath.setAttribute(
    'd',
    'M14 3V3.28988C16.8915 4.15043 19 6.82898 19 10V17H20V19H4V17H5V10C5 6.82898 7.10851 4.15043 10 3.28988V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3ZM7 17H17V10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10V17ZM14 21V20H10V21C10 22.1046 10.8954 23 12 23C13.1046 23 14 22.1046 14 21Z',
  );

  notificationIcon.appendChild(iconPath);
  return notificationIcon;
}

function renderNotificationButton() {
  const notificationButton = document.createElement('button');
  const notificationBadge = renderNotificationBadge();
  const notificationIcon = renderNotificationIcon();

  notificationButton.id = NOTIFICATION_BUTTON_ID;
  notificationButton.classList.add('notification_button');

  notificationButton.append(notificationIcon);
  notificationButton.append(notificationBadge);

  return notificationButton;
}

function renderNotificationDropdown() {
  const notificationDrawer = document.createElement('div');
  const notificationDropdown = document.createElement('ul');

  notificationDrawer.id = NOTIFICATION_DROPDOWN_ID;
  notificationDrawer.classList.add('notification_dropdown__drawer');

  notificationDropdown.id = NOTIFICATION_LIST_ID;
  notificationDropdown.classList.add('notification_dropdown__dropdown');
  notificationDrawer.tabIndex = -1;
  notificationDropdown.innerHTML =
    '<li id="notification-placeholder" class="notification_dropdown__drawer__item"><h6>You have no new notifications</h6></li>';

  notificationDrawer.append(notificationDropdown);
  return notificationDrawer;
}

function renderNotificationListItem(sseMessage) {
  const li = document.createElement('li');
  const title = document.createElement('h6');
  const text = document.createElement('p');
  const link = document.createElement('a');

  /** @type GhostNotification */
  const ghostNotification = JSON.parse(sseMessage.data);

  li.classList.add('notification_dropdown__drawer__item');
  li.dataset.postId = ghostNotification.postId;
  title.textContent =
    ghostNotification.type === 'post-updated'
      ? 'Article updated'
      : 'Article published';

  text.textContent = ghostNotification.postTitle;
  text.classList.add('notification_dropdown__text');
  link.href = ghostNotification.ghostOriginalUrl;
  link.target = '_blank';
  link.innerText = 'Read it now';
  link.classList.add('notification_dropdown__button');

  li.append(title);
  li.append(text);
  li.append(link);
  return li;
}

function registerPlugin() {
  const casperHeadActions = document.querySelector('.gh-head-actions');
  casperHeadActions?.append(renderNotificationUi());
}

function initEventSource() {
  subscription.addEventListener('open', (ev) => {
    console.log('Connection opened');
  });

  subscription.addEventListener('error', () => {
    console.log("Connection err'd");
    subscription.close();
  });

  subscription.addEventListener('replace', (ev) => {
    document.getElementById('notification-placeholder')?.remove();
    document
      .getElementById(NOTIFICATION_LIST_ID)
      ?.prepend(renderNotificationListItem(ev));
    document.getElementById(NOTIFICATION_BADGE_ID)?.classList.remove('hidden');
  });

  subscription.addEventListener('insert', (ev) => {
    document.getElementById('notification-placeholder')?.remove();
    document
      .getElementById(NOTIFICATION_LIST_ID)
      ?.prepend(renderNotificationListItem(ev));
    document.getElementById(NOTIFICATION_BADGE_ID)?.classList.remove('hidden');
  });

  window.addEventListener('close', () => subscription.close());
}

function main() {
  registerPlugin();
  initEventSource();
}

window.addEventListener('load', () => main());
