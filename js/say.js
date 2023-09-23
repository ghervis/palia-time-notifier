window.firefoxVoiceLoadedRetryCount = 300;

export function loadVoices() {
	window.firefoxVoiceLoadedEventInterval = setInterval(() => {
		if (!window.firefoxVoiceLoadedRetryCount) {
			clearInterval(window.firefoxVoiceLoadedEventInterval);
			window.alert('Unable to load voice list.');
			return;
		}

		if (speechSynthesis.getVoices().length) {
			_proceedWithProcess();
			return;
		}

		window.firefoxVoiceLoadedRetryCount -= 1;
	}, 100);

	speechSynthesis.onvoiceschanged = _proceedWithProcess;

	function _proceedWithProcess() {
		clearInterval(window.firefoxVoiceLoadedEventInterval);

		document.dispatchEvent(new CustomEvent('voices-loaded'));
	}
}

export function doSpeak(theText) {
	speechSynthesis.cancel();

	let speech = new SpeechSynthesisUtterance(theText);

	speech.text = theText;
	
	const voices = speechSynthesis.getVoices();
	
	const selectedVoice = window.localStorage.getItem('selected-voice');

	const voice = voices.find((eachVoice) => eachVoice.name === selectedVoice);

	speech.default = false;
	
	speech.voice = voice;
	
	speech.volume = Number.parseInt(window.localStorage.getItem('voice-volume'), 10)/100;
	
  speechSynthesis.speak(speech);
}
