
import * as Say from './say.js';
import * as Util from './util.js';

const _PREFERRED_VOICES = ["Google UK English Female", "Microsoft Linda - English (Canada)"];

export function onTimeChecked(checkBoxId) {
	const checkBoxElement = document.getElementById(checkBoxId);
  window.localStorage.setItem(
    checkBoxId,
    checkBoxElement.checked
	);

	checkBoxElement.closest('div[id]').setAttribute('data-is-checked', checkBoxElement.checked);
};

export function onTextChange(textBoxId) {
  window.localStorage.setItem(textBoxId, document.getElementById(textBoxId).value);
};

export function isChecked(checkBoxId) {
	return "true" === window.localStorage.getItem(checkBoxId);
};

export function getTextValue(textBoxId) {
	let textValue = window.localStorage.getItem(textBoxId);

  if (null === textValue) {
    return "";
	}
	
	return textValue;
};

export function onToggleShowAll() {
	const showAllBooleanValue = document.getElementById("checkbox-show-all").checked;

	window.localStorage.setItem('show-all', showAllBooleanValue);

	document.getElementById("palia-times-container").setAttribute('data-show-all', showAllBooleanValue);
}

export function initializeShowAll() {
	const showAllSavedStringValue = window.localStorage.getItem('show-all');
	const showAllBooleanValue = 'string' === typeof showAllSavedStringValue ? ("true" === showAllSavedStringValue) : true;
	
	document.getElementById("checkbox-show-all").checked = showAllBooleanValue;
	window.localStorage.setItem('show-all', showAllBooleanValue);
	document.getElementById("palia-times-container").setAttribute('data-show-all', showAllBooleanValue);
}

export function initializeNotifications() {
	const notificationEnabledStringValue = window.localStorage.getItem('enable-notifications');
	const notificationsEnabledBooleanValue = 'string' === typeof notificationEnabledStringValue ? ("true" === notificationEnabledStringValue) : false;
	window.localStorage.setItem('enable-notifications', notificationsEnabledBooleanValue);
	document.getElementById("enable-notifications").checked = notificationsEnabledBooleanValue
};

export function setEnableNotifications(booleanValue) {
	window.localStorage.setItem('enable-notifications', booleanValue);
}

export function initializeSelectedVoice() {
	const savedSelectedVoice = window.localStorage.getItem('selected-voice');

	const voices = speechSynthesis.getVoices();

	if (null === savedSelectedVoice) {
		const initialVoice = _pickInitialSelectedVoice();
		
		_setVoice(initialVoice);

		return;
	}

	const matchedVoice = voices.find((eachVoice) => eachVoice.name === savedSelectedVoice) || _pickInitialSelectedVoice();

	_setVoice(matchedVoice);
}

export function onVoiceDropdownChange() {
	const selectedIndex = document.getElementById("voices-dropdown").selectedIndex;

	const voices = speechSynthesis.getVoices();
	
	_setVoice(voices[selectedIndex]);
	
	const ingameTimeDisplay = Util.getIngameTimeDisplay();

	Say.doSpeak(`It is now ${ingameTimeDisplay} in Palia.`);
}

export function toggleSettings() {
	document.getElementById('settings-dialog').showModal();
}

export function closeSettingsDialog() {
	document.getElementById('settings-dialog').close();
}

export function initializeVoiceVolume() {
	const voiceVolumeStringValue = window.localStorage.getItem('voice-volume');
	const voiceVolumeNumberValue = 'string' !== typeof voiceVolumeStringValue || !/^[0-9]+$/.test(voiceVolumeStringValue) ? 90 : Number.parseInt(voiceVolumeStringValue, 10);
	window.localStorage.setItem('voice-volume', voiceVolumeNumberValue);
	document.getElementById("voice-volume").value = voiceVolumeNumberValue;
}

export function onVoiceVolumeChange() {
	window.localStorage.setItem('voice-volume', document.getElementById('voice-volume').value);
}

export function initializeDarkMode() {
	const darkModeStringValue = window.localStorage.getItem('dark-mode');
	const darkModeBooleanValue = 'string' !== typeof darkModeStringValue || !/^(true|false)$/.test(darkModeStringValue) ? false : ('true' === darkModeStringValue ? true : false);
	window.localStorage.setItem('dark-mode', darkModeBooleanValue);
	document.getElementById("dark-mode").checked = darkModeBooleanValue;
	document.body.classList.toggle('dark-mode', darkModeBooleanValue);
}

export function toggleDarkMode() {
	window.localStorage.setItem('dark-mode', document.getElementById('dark-mode').checked);
	document.body.classList.toggle('dark-mode', document.getElementById('dark-mode').checked);
}

const _pickInitialSelectedVoice = () => {
	const voices = speechSynthesis.getVoices();

	if (!Array.isArray(voices) || !voices.length) {
		console.error('Unable to initialize. voice list are empty.');

		window.alert('No voice is available.');
		return;
	}

	const foundVoice = _PREFERRED_VOICES.map((eachPreferredVoice) => voices.find((eachVoice)=> eachVoice.name === eachPreferredVoice)).filter(Boolean);

	if (!foundVoice.length) {
		return voices[0];
	}

	return foundVoice[0];
}

const _setVoice = (voiceObject) => {
	const voices = speechSynthesis.getVoices();
	window.localStorage.setItem('selected-voice', voiceObject.name);
	const voiceIndex = voices.findIndex((eachVoice) => voiceObject.name === eachVoice.name);
	document.getElementById("voices-dropdown").selectedIndex = voiceIndex;
}