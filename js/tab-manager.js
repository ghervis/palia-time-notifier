export function registerVisibilityChangeEvent() {
	_onVisibilityChange();
	document.addEventListener("visibilitychange", _onVisibilityChange);
}

export function updateTitle() {
	_onVisibilityChange();
}

const _onVisibilityChange = () => {
	if (document.hidden) {
		document.title = window.ingameTimeDisplay ? `${window.ingameTimeDisplay} - Palia Time Notifier` : `Palia Time Notifier`;
	} else {
		document.title = `Palia Time Notifier`;
	}
};