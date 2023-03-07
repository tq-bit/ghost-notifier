'use strict';

const GN_COOKIE_NAME = 'x-gn-user-token';

function getCookie(name) {
    var _a;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return (_a = parts.pop()) === null || _a === void 0 ? void 0 : _a.split(';').shift();
}
var SessionState = {
    toggleElementsByUserSessionState() {
        const activeElementsInSession = document.querySelectorAll('[data-user-session="active"]');
        const activeElementsOutSession = document.querySelectorAll('[data-user-session="inactive"]');
        const userToken = getCookie(GN_COOKIE_NAME);
        console.log(userToken);
        if (userToken) {
            activeElementsOutSession.forEach((element) => element.remove());
        }
        else {
            activeElementsInSession.forEach((element) => element.remove());
        }
    },
};

function main() {
    SessionState.toggleElementsByUserSessionState();
}
main();
