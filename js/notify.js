import * as Say from './say.js';
import * as Util from './util.js';
import * as NotificationManager from './notification.js';

window.lastNotificationId = undefined;

export function doNotify(timeId) {
	const thisNotificationId = `${timeId}-${new Date().getHours()}`;

  if (window.lastNotificationId === thisNotificationId) {
    return;
	}

	const thatTimeElement = document.getElementById(timeId);
	
	if (!thatTimeElement) {
		return;
	}

  const thatCheckbox = thatTimeElement.querySelector('input[type="checkbox"]');

  if (!thatCheckbox.checked) {
    return;
	}
	
	const thatInput = thatTimeElement.querySelector('textarea');
	
	let textValue = thatInput.value;

  if (
    "string" !== typeof textValue ||
    0 === textValue.trim().length
  ) {
		const [_, hour, minute] = timeId.match(/^(\d+):(\d+)$/);

		textValue = thatInput.placeholder;
	}

	window.lastNotificationId = thisNotificationId;

	_testSound();

	Say.doSpeak(textValue);

	NotificationManager.createNotification(timeId, 'Palia Time Notification', textValue);
};

function _testSound() {
	if (window.testSound) { return; }
	
	window.testSound = true;
	document.getElementById('click-sound').play()
	.catch( () => {
		window.alert('This page needs user interaction to autoplay sounds.\nTo avoid/bypass this browser restriction in the future, please set this page Site Settings > Sounds to "Allow".')
	});
}