import * as Settings from "./settings.js";
import * as Util from "./util.js";

document.body.addEventListener("wheel", _onWheelEvent);

export function createTimers() {
  const existingCheckedEntries = Object.entries({
    ...window.localStorage,
  }).filter(([k, _]) => /^checked-[0-2][0-9]\:[0-5][0-9]$/.test(k));

  const sortedCheckedEntries = existingCheckedEntries.sort(
    ([aKey, av], [bKey, bv]) => {
      const [_left, aTimeId] = aKey.match(/^checked-(.+)$/);
      const [_right, bTimeId] = bKey.match(/^checked-(.+)$/);

      return (
        Util.getTimeIdSortingValue(aTimeId) -
        Util.getTimeIdSortingValue(bTimeId)
      );
    }
  );

  sortedCheckedEntries.forEach(([checkedKey, checkedValue]) => {
    let [_checkedKey, timeId] = checkedKey.match(/^checked-(.+)$/);
    addTimeElement(timeId, checkedValue);
  });
}

export function addTimeElement(timeId, isChecked) {
  const timeElement = createTimeElement(timeId, isChecked);
  const timesContainer = document.getElementById("palia-times-container");
  timesContainer.appendChild(timeElement);
  resizeTextArea(timeId);
}

export function resizeTextArea(timeId) {
  const textAreaElement = document.getElementById(`text-${timeId}`);
  textAreaElement.style.height = 0;
  textAreaElement.style.height = textAreaElement.scrollHeight + "px";
}

export function createVoicesDropdown() {
  const voicesContainer = document.getElementById("voices-container");

  const voices = speechSynthesis.getVoices();

  const voicesDropdown = document.createElement("select");

  voicesDropdown.id = "voices-dropdown";

  voicesDropdown.onchange = Settings.onVoiceDropdownChange;

  let voicesDropdownOptions = "";

  voices.forEach((eachVoice, voiceIndex) => {
    voicesDropdownOptions += `<option value="${voiceIndex}">${eachVoice.name}</option>`;
  });

  voicesDropdown.innerHTML = voicesDropdownOptions;

  document.getElementById("voices-container").appendChild(voicesDropdown);
}

export function createTimeElement(timeId, wasChecked) {
  const timeContainer = document.createElement("div");
  timeContainer.id = timeId;

  const checkBoxId = `checked-${timeId}`;

  const isChecked =
    "undefined" !== typeof wasChecked
      ? Util.getBooleanValue(wasChecked)
			: Settings.isChecked(checkBoxId);

  timeContainer.setAttribute("data-is-checked", isChecked);

  const textBoxId = `text-${timeId}`;

  let [_h, thatHour] = timeId.match(/^(\d+)\:\d+$/);
  const [_m, thirtyString] = timeId.match(/^\d+\:(\d+)$/);

  thatHour = Number.parseInt(thatHour, 10);

  const twelveHour = Util.getTwelveHour(thatHour);

  const twelveAndThirtyAndMeridiemText = `${twelveHour}:${thirtyString} ${Util.getMeridiemText(
    thatHour
  )}`;

  timeContainer.innerHTML = `<div class="time-header">
					<label class="time-header-label" title="Check this if you want to get notifications every ${twelveAndThirtyAndMeridiemText}">
					<input type="checkbox"
					id="${checkBoxId}"
					onchange="onTimeChecked('${checkBoxId}')"${isChecked ? " checked" : ""}
					/>
					<span class="time-header-label-text">${twelveAndThirtyAndMeridiemText}</span><span class="time-enabled material-symbols-outlined">
					alarm
					</span>
					</label>
					<button class="time-voice-preview">
					<span class="material-symbols-outlined" title="Hear a preview for this notification's message" onclick="previewTime('${timeId}')">
					record_voice_over
					</span>
					</button>
					<button class="delete-time" title="Delete this time" onclick="deleteTime('${timeId}')"><span class="material-symbols-outlined">
					close
					</span></button>
					</div>
					<div class="custom-message">
						<textarea id="${textBoxId}"
						onkeyup="onTextChange('${textBoxId}')"
						oninput="onTextAreaInput(this)"
							placeholder="It is now ${twelveAndThirtyAndMeridiemText} in Palia."
							title="Text here would be spoken every ${twelveAndThirtyAndMeridiemText}"
							>${Settings.getTextValue(textBoxId)}</textarea>
					</div>
					`;
	
  return timeContainer;
}

export function getTimeElementIndex(timeId) {
  const existingCheckedEntries = Object.keys({
    ...window.localStorage,
  }).filter((k) => /^checked-[0-2][0-9]\:[0-5][0-9]$/.test(k));

  let timeIdsOnly = existingCheckedEntries.map((checkedTimeId) => {
    const [_, timeId] = checkedTimeId.match(/^checked-(.+)$/);
    return timeId;
  });

  timeIdsOnly.push(timeId);

  const sortedKeys = timeIdsOnly.sort(
    (a, b) => Util.getTimeIdSortingValue(a) - Util.getTimeIdSortingValue(b)
  );

  return sortedKeys.findIndex((eachTimeId) => timeId === eachTimeId);
}

export function updateAddTimePlaceholder() {
  const addTimeHourValue = document.getElementById("add-time-hour").value;
  const addTimeMinuteValue = document.getElementById("add-time-minute").value;
  const addTimeMeridiemValue =
    document.getElementById("add-time-meridiem").value;

  document.getElementById(
    "add-time-message"
  ).placeholder = `It is now ${addTimeHourValue}:${addTimeMinuteValue} ${addTimeMeridiemValue} in Palia.`;
}

export function onTextAreaInput(element) {
  elem.style.height = 0;
  elem.style.height = `${elem.scrollHeight}px`;
}

function _onWheelEvent(event) {
	_processDropdownScrollCallback(event);
}

export function addDropdownScrollCallback(elementId) {
  const addTimeMinuteElement = document.getElementById(elementId);

  addTimeMinuteElement.onmouseover = addTimeMinuteElement.onmouseout = (event) => {
    window.dropdownScrollCallbackHoveredElement =
      "mouseover" === event.type ? event.target : null;
  };
}

export function getInputTextValue(element) {
	let textValue = element.value;

  if (
    "string" !== typeof textValue ||
    0 === textValue.trim().length
  ) {
		return element.placeholder;
	}

	return textValue;
}

const _processDropdownScrollCallback = (event) => {
	const elementToScroll = window.dropdownScrollCallbackHoveredElement
	if (!elementToScroll) {
		return;
	}

	const totalOptions = elementToScroll.length;
	const currentSelectedIndex = window.dropdownScrollCallbackHoveredElement.selectedIndex;
	const addOrSubtractDropdownSelectedIndex = _isScrollingUp(event) ? -1 : 1;

	const newIndex = elementToScroll.selectedIndex + addOrSubtractDropdownSelectedIndex;

	elementToScroll.selectedIndex = newIndex > (totalOptions - 1) ? 0 : (newIndex < 0 ? totalOptions-1 : newIndex);
}

const _isScrollingUp = (event) => {
	return event.wheelDelta ? event.wheelDelta > 0 : event.deltaY < 0;
}

function _createEachTimer(i) {
  const thatHour = Math.floor(i / 2) % 24;
  const thirtyString = 0 === i % 2 ? "00" : "30";
  const timeId = `${thatHour
    .toString()
    .padStart(2, "0")}:${thirtyString.padStart(2, "0")}`;

  return createTimeElement(timeId);
}
