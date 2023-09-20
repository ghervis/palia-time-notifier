import * as CONSTANTS from './constants.js';
import * as Notify from './notify.js';
import * as InGameTime from './ingame-time.js';
import * as Util from './util.js';

export function run() {
	const inGameTimeDecimal = Util.getCurrentIngameTimeDecimal();
	
	InGameTime.updateInGameTime();
	
	const timeId = Util.getTimeId(inGameTimeDecimal);
	
	Notify.doNotify(timeId);
}