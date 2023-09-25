import * as Element from "./element.js";
import * as Settings from "./settings.js";
import * as NotificationManager from "./notification.js";
import * as Main from "./main.js";
import * as TabManager from "./tab-manager.js";
import * as Say from "./say.js";

(async () => {
  Settings.initializeDarkMode();
  Settings.initializeCheckedTimers();

  Element.createTimers();

  Settings.initializeShowAll();
  Settings.initializeNotifications();
  Settings.initializeVoiceVolume();

  window.onTimeChecked = Settings.onTimeChecked;

  window.onTextChange = Settings.onTextChange;

  window.toggleShowAll = Settings.onToggleShowAll;

  window.toggleEnableNotifications =
    NotificationManager.toggleEnableNotifications;

  window.toggleSettings = Settings.toggleSettings;

  window.closeSettingsDialog = Settings.closeSettingsDialog;

  window.onVoiceVolumeChange = Settings.onVoiceVolumeChange;

  window.toggleDarkMode = Settings.toggleDarkMode;

  window.addTime = () => {
    const addTimeHourValue = document.getElementById("add-time-hour").value;
    const addTimeMinuteValue = document.getElementById("add-time-minute").value;
    const addTimeMeridiemValue =
      document.getElementById("add-time-meridiem").value;

    if (!/^(AM|PM)$/.test(addTimeMeridiemValue)) {
      return;
    }

    if (!/^(01|02|03|04|05|06|07|08|09|10|11|12)$/.test(addTimeHourValue)) {
      return;
    }

    if (!/^[0-5][0-9]$/.test(addTimeMinuteValue)) {
      return;
    }

    let hourIdValue = Number.parseInt(addTimeHourValue, 10);

    if (12 === hourIdValue) {
      if ("AM" === addTimeMeridiemValue) {
        hourIdValue = 0;
      }
    } else {
      if ("PM" === addTimeMeridiemValue) {
        hourIdValue += 12;
      }
    }

    const timeId = `${hourIdValue
      .toString()
      .padStart(2, "0")}:${addTimeMinuteValue}`;

		const checkedKey = `checked-${timeId}`;

		if (window.localStorage.getItem(checkedKey)) {
			document.getElementById('add-time-hour').setCustomValidity("Time setting already exist.");
			document.getElementById('add-time-hour').reportValidity();
			return;
		}

		window.localStorage.setItem(checkedKey, true);
		
		window.localStorage.setItem(`text-${timeId}`, (document.getElementById('add-time-message').value || '').trim());

		const timeElement = Element.createTimeElement(timeId, true);

		const timesContainer = document.getElementById('palia-times-container');

		timesContainer.insertBefore(timeElement, timesContainer.childNodes[Element.getTimeElementIndex(timeId) + 1]);
		
		document.getElementById('add-time-dialog').close();
	};
	
	window.deleteTime = (timeId) => {
		window.localStorage.removeItem(`checked-${timeId}`);
		window.localStorage.removeItem(`text-${timeId}`);
		document.getElementById(timeId).remove();
	}

  window.showAddTimeDialog = Settings.showAddTimeDialog;
  window.closeAddTimeDialog = Settings.closeAddTimeDialog;

  TabManager.registerVisibilityChangeEvent();

  document.addEventListener("voices-loaded", async () => {
    Element.createVoicesDropdown();

    Settings.initializeSelectedVoice();

    var worker = new Worker("./js/worker.js");
    worker.onmessage = function () {
      Main.run();
    };
  });

  Say.loadVoices();
})();
