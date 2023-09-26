import * as Element from "./element.js";

export function showAddTimeDialog() {
  document.getElementById("add-time-dialog").showModal();
  Element.updateAddTimePlaceholder();
}

export function addTime() {
  const addTimeHourValue = document.getElementById("add-time-hour").value;
  const addTimeMinuteValue = document.getElementById("add-time-minute").value;
  const addTimeMeridiemValue =
    document.getElementById("add-time-meridiem").value;

  if (!/^(AM|PM)$/.test(addTimeMeridiemValue)) {
    return;
  }

  if (!/^(1|2|3|4|5|6|7|8|9|10|11|12)$/.test(addTimeHourValue)) {
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
    document
      .getElementById("add-time-hour")
      .setCustomValidity("Time setting already exist.");
    document.getElementById("add-time-hour").reportValidity();
    return;
  }

  window.localStorage.setItem(checkedKey, true);

  window.localStorage.setItem(
    `text-${timeId}`,
    (document.getElementById("add-time-message").value || "").trim()
  );

  const timeElement = Element.createTimeElement(timeId, true);

  const timesContainer = document.getElementById("palia-times-container");

  timesContainer.insertBefore(
    timeElement,
    timesContainer.childNodes[Element.getTimeElementIndex(timeId) + 1]
	);
	
	Element.resizeTextArea(timeId);

  document.getElementById("add-time-dialog").close();
}

export function deleteTime(timeId) {
	window.localStorage.removeItem(`checked-${timeId}`);
	window.localStorage.removeItem(`text-${timeId}`);
	document.getElementById(timeId).remove();
}

export function closeAddTimeDialog() {
	document.getElementById('add-time-dialog').close();
}