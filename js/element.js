import * as Settings from './settings.js';
import * as Util from './util.js';

export function createTimers() {
  const timesContainer = document.getElementById("palia-times-container");

  for (let i = 0; i < 48; i += 1) {
    timesContainer.appendChild(_createEachTimer(i));
  }
}

export function createVoicesDropdown() {
	const voicesContainer = document.getElementById("voices-container");

	const voices = speechSynthesis.getVoices();

	const voicesDropdown = document.createElement("select");

	voicesDropdown.id = 'voices-dropdown';

	voicesDropdown.onchange = Settings.onVoiceDropdownChange;

	let voicesDropdownOptions = '';

	voices.forEach((eachVoice, voiceIndex) => {
		voicesDropdownOptions += `<option value="${voiceIndex}">${eachVoice.name}</option>`;
	});

	voicesDropdown.innerHTML = voicesDropdownOptions;

	document.getElementById("voices-container").appendChild(voicesDropdown);
}

function _createEachTimer(i) {
  const timeContainer = document.createElement("div");
  const thatHour = (Math.floor(i / 2)) % 24;
  const thirtyString = 0 === i % 2 ? "00" : "30";
  const timeId = `${thatHour
    .toString()
    .padStart(2, "0")}:${thirtyString.padStart(2, "0")}`;
	timeContainer.id = timeId;

  const checkBoxId = `checked-${timeId}`;
	
	const isChecked = Settings.isChecked(
		checkBoxId
	);

	timeContainer.setAttribute('data-is-checked', isChecked);

	const textBoxId = `text-${timeId}`;
	
	const twelveHour = Util.getTwelveHour(thatHour);

	const twelveAndThirtyAndMeridiemText = `${twelveHour}:${thirtyString} ${Util.getMeridiemText(thatHour)}`;

  timeContainer.innerHTML = `<div>
					<label title="Check this if you want to get notifications every ${twelveAndThirtyAndMeridiemText}">
					<input type="checkbox"
					id="${checkBoxId}"
					onchange="onTimeChecked('${checkBoxId}')"${isChecked ? ' checked' : ''}
					/>
					<span>${twelveAndThirtyAndMeridiemText}</span>
					</label>
					</div>
					<div class="custom-message">
						<input type="text" id="${textBoxId}"
						onkeyup="onTextChange('${textBoxId}')"
						value="${Settings.getTextValue(textBoxId)}"
							placeholder="It is now ${twelveAndThirtyAndMeridiemText} in Palia."
							title="Text here would be spoken every ${twelveAndThirtyAndMeridiemText}"
							/>
					</div>
					`;

  return timeContainer;
}
