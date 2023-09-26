import * as Element from "./element.js";
import * as Settings from "./settings.js";
import * as NotificationManager from "./notification.js";
import * as Main from "./main.js";
import * as TabManager from "./tab-manager.js";
import * as Say from "./say.js";
import * as Action from "./action.js";

(async () => {
  Settings.initializeDarkMode();
  Settings.initializeCheckedTimers();

  Element.createTimers();

  Settings.initializeNotifications();
  Settings.initializeVoiceVolume();

  window.onTimeChecked = Settings.onTimeChecked;

  window.onTextChange = Settings.onTextChange;

  window.toggleEnableNotifications =
    NotificationManager.toggleEnableNotifications;

  window.toggleSettings = Settings.toggleSettings;

  window.closeSettingsDialog = Settings.closeSettingsDialog;

  window.onVoiceVolumeChange = Settings.onVoiceVolumeChange;

	window.toggleDarkMode = Settings.toggleDarkMode;
	
	window.updateAddTimePlaceholder = Element.updateAddTimePlaceholder;

  window.showAddTimeDialog = Action.showAddTimeDialog;
	window.addTime = Action.addTime;
	window.deleteTime = Action.deleteTime;
	window.closeAddTimeDialog = Action.closeAddTimeDialog;
	
	window.onTextAreaInput = (elem) => {
  	elem.style.height = 0;
  	elem.style.height = (elem.scrollHeight) + "px";
	}

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
