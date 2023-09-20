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

  const thatCheckbox = thatTimeElement.querySelector('input[type="checkbox"]');

  if (!thatCheckbox.checked) {
    return;
  }

	const thatInput = thatTimeElement.querySelector('input[type="text"]');
	
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
	.catch( (a,b,c) => {
		window.alert('This webpage would like to play sounds.\nBrowser needs user interactions on this page to autoplay a sound.\nTo avoid/bypass this restriction in the future, please set this Site Settings > Sounds to "Allow".')
	});
}