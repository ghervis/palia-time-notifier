import * as Element from './element.js';
import * as Settings from './settings.js';
import * as NotificationManager from './notification.js';
import * as Main from './main.js';
import * as TabManager from './tab-manager.js';
import * as Say from './say.js';

(async () => {
	Settings.initializeDarkMode();
	Element.createTimers();
	
	Settings.initializeShowAll();
	Settings.initializeNotifications();
	Settings.initializeVoiceVolume();

	window.onTimeChecked = Settings.onTimeChecked;
	
	window.onTextChange = Settings.onTextChange;

	window.toggleShowAll = Settings.onToggleShowAll;

	window.toggleEnableNotifications = NotificationManager.toggleEnableNotifications;

	window.toggleSettings = Settings.toggleSettings;

	window.closeSettingsDialog = Settings.closeSettingsDialog;

	window.onVoiceVolumeChange = Settings.onVoiceVolumeChange;

	window.toggleDarkMode = Settings.toggleDarkMode;

	TabManager.registerVisibilityChangeEvent();

	document.addEventListener("voices-loaded", async () => {
		Element.createVoicesDropdown();
		
		Settings.initializeSelectedVoice();

		var worker = new Worker('./js/worker.js');
		worker.onmessage = function () {
				Main.run()
		}
	});

	Say.loadVoices();
})();
