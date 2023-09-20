import * as Util from './util.js';
import * as TabManager from './tab-manager.js';

export function updateInGameTime() {
	const ingameTimeDisplay = Util.getIngameTimeDisplay();

	window.ingameTimeDisplay = ingameTimeDisplay;

	document.getElementById('ingame-time').innerText = ingameTimeDisplay;
	
	TabManager.updateTitle();
}