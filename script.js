/*
 consts
*/

const numOfWeeksInSemester = 14;

const hourCodeMap = {
  0: "080000",
  1: "090000",
  2: "100000",
  3: "110000",
  4: "120000",
  5: "130000",
  6: "140000",
  7: "150000",
  8: "160000",
  9: "170000",
  10: "180000",
  11: "190000",
  12: "200000",
};

const firstDayMap = {
  SUNDAY: "20220320",
  MONDAY: "20220321",
  TUESDAY: "20220322",
  WEDNESDAY: "20220323",
  THURSDAY: "20220324",
  FRIDAY: "20220325",
};


/*
  helper functions
 */

const getRowHourStr = (row) => {
  return row.children[0].getAttribute("id");
}

const getDaySlotsForCurrentHour = (row) => {
  return [...row.children].splice(1);
}

const containsClass = (slot) => {
  return slot.textContent.includes("קורס");
}

const getEventData = (slot, hourStr) => {
  return {
    day: slot.getAttribute("headers").split(" ")[0],
    hourCode: parseInt(hourStr.substring(7)),
    description: slot.textContent,
  };
}

const parseCalendarHTML = (table) => {
  const classes = [];
  table.forEach((row) => {
    const hourStr = getRowHourStr(row);
    let isActualHourRow = hourStr && hourStr !== "HOURSTR-1";
    if (isActualHourRow) {
      const daySlotsForCurrentHour = getDaySlotsForCurrentHour(row);
      daySlotsForCurrentHour.forEach((slot) => {
        if (containsClass(slot)) {
          const eventData = getEventData(slot, hourStr);
          classes.push(createClassEvent(eventData));
        }
      });
    }
  });
  return classes;
}

const getCalendarFileStr = (table) => {
  const classEvents = parseCalendarHTML(table);
  return createCalendarFile(classEvents);
}

const clickOnDownload = (e) => {
  e.preventDefault();

  const table = getTable();
  const calendarFileStr = getCalendarFileStr(table);
  download('bgu_calendar.ics', calendarFileStr)
};

const getTable = () => {
  return [...document.querySelector(".standardLook").children[0].children];
};

const createClassEvent = (eventData) => {
  let event = "BEGIN:VEVENT\n";
  event += `DTSTART;TZID=Asia/Jerusalem:${firstDayMap[eventData.day]}T${
      hourCodeMap[eventData.hourCode]
  }\n`;

  event += `DTEND;TZID=Asia/Jerusalem:${firstDayMap[eventData.day]}T${
      hourCodeMap[eventData.hourCode + 1]
  }\n`;

  event += `RRULE:FREQ=WEEKLY;BYDAY=${eventData.day.substring(0, 2)};INTERVAL=1;COUNT=${numOfWeeksInSemester}\n`;
  event += `SUMMARY:${eventData.description.split("\n")[0]}\n`;
  event += "END:VEVENT\n";
  return event;
};

const createCalendarFile = (classes) => {
  let calendar = "BEGIN:VCALENDAR\n";
  calendar += "VERSION:2.0\n";
  calendar += "BEGIN:VTIMEZONE\n";
  calendar += "TZID:Asia/Jerusalem\n";
  calendar += "END:VTIMEZONE\n";
  classes.forEach((classEvent) => {
    calendar += classEvent;
  });

  calendar += "END:VCALENDAR\n";
  return calendar;
};

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const createDownloadButton = () => {
  const btn = document.createElement("button");
  btn.addEventListener("click", clickOnDownload);
  btn.innerHTML = "הורד מערכת שעות";
  return btn;
}

/*
  main script
 */
const title = document.querySelector(".uRegionHeading");
const isHourTablePage = title && title.textContent.includes("מערכת שעות");

if (isHourTablePage) {
  const actionBar = document.getElementsByClassName(
    "uRegionContent clearfix"
  )[0];
  if (actionBar) {
    const btn = createDownloadButton();
    actionBar.appendChild(btn);
  }
}
