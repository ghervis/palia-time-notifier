import * as Settings from './settings.js';

export function toggleEnableNotifications() {
	if (!document.getElementById('enable-notifications').checked) {
		Settings.setEnableNotifications(false);
		return;
	}

	Notification.requestPermission((result) => {
		Settings.setEnableNotifications('granted' === result);
	});
}

export function createNotification(timeId, title, message) {
	if ('true' === window.localStorage.getItem('enable-notifications')) {

		navigator.serviceWorker.register('sw.js');
		Notification.requestPermission(function(result) {
			if (result === 'granted') {
				navigator.serviceWorker.ready.then(function(registration) {
					registration.showNotification(title, { body: message, tag: timeId, icon: 'Exquisite_Hoe.png' });
				});
			}
		});

		// new Notification(title, { body: message, tag: timeId, icon: 'Exquisite_Hoe.png' });
	}
}