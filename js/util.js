import * as CONSTANTS from './constants.js';

export function getTwelveHour(numberValue) {
	return numberValue === 0 || numberValue === 12 ? 12 : numberValue % 12;
};

export function getMeridiemText(twentyFourHour) {
	return twentyFourHour > 11 ? 'PM' : 'AM'
};

export function getCurrentIngameTimeDecimal() {
	const [_, currentMinute, currentSeconds] = new Date()
	.toUTCString()
	.match(/(\d+):(\d+) GMT$/);
	
	const minuteNumber = Number.parseInt(currentMinute, 10);
	
	const minutesFromDailyMinute = minuteNumber - CONSTANTS.STEADY_DAILY_MINUTE;
	
	return CONSTANTS.DISPLAY_START_INGAME_HOUR +
		(minutesFromDailyMinute + currentSeconds / 60) / 2.5;
}

export function getTimeId(ingameTimeDecimal) {
	const flooredHour = Number.parseFloat(
		(Math.floor(ingameTimeDecimal * 2) / 2).toFixed(1)
		);
		
	// const flooredMinute = 0.5 === flooredHour % 1 ? 30 : 0;
	const flooredMinute = Math.floor(60 * (ingameTimeDecimal % 1));
		
		return `${Math.floor(flooredHour)
		.toString()
			.padStart(2, "0")}:${flooredMinute.toString().padStart(2, "0")}`;
}

export function getIngameTimeDisplay() {
	const inGameTimeDecimal = getCurrentIngameTimeDecimal();
	const floorHour = Math.floor(inGameTimeDecimal);
	const ingameHour = getTwelveHour(floorHour);
	const ingameMinute = Math.floor((inGameTimeDecimal % 1) * 60);

	return `${ingameHour}:${ingameMinute.toString().padStart(2, '0')} ${getMeridiemText(floorHour)}`;
}

export function getTimeIdSortingValue(timeId) {
	return Number.parseInt(timeId.replace(/\:/, ''), 10);
}