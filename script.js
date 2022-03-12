const onClick = (e) => {
  e.preventDefault();
  const classes = [];
  const table = getTable();
  console.log(table);
  table.forEach((row) => {
    const hourStr = row.children[0].getAttribute("id");
    if (hourStr && hourStr !== "HOURSTR-1") {
      const days = [...row.children].splice(1);
      days.forEach((day) => {
        if (day.textContent.includes("קורס")) {
          const eventData = {
            day: day.getAttribute("headers").split(" ")[0],
            hourCode: parseInt(hourStr.substring(7)),
            description: day.textContent,
          };
          classes.push(createEvent(eventData));
        }
      });
    }
  });
  const calendar = getCalendarFile(classes);
  console.log(calendar);
};

const title = document.querySelector(".uRegionHeading");
if (title && title.textContent.includes("מערכת שעות")) {
  const actionBar = document.getElementsByClassName(
    "uRegionContent clearfix"
  )[0];
  if (actionBar) {
    const btn = document.createElement("button");
    btn.addEventListener("click", onClick);
    btn.innerHTML = "הורד מערכת שעות";
    actionBar.appendChild(btn);
  }
}

const getTable = () => {
  return [...document.querySelector(".standardLook").children[0].children];
};

const semesterStart = "DTSTART;TZID=Asia/Jerusalem:20220320T080000\n";

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

const createEvent = (eventData) => {
  let event = "BEGIN:VEVENT\n";
  event += `DTSTART;TZID=Asia/Jerusalem:${firstDayMap[eventData.day]}T${
    hourCodeMap[eventData.hourCode]
  }\n`;

  event += `DTEND;TZID=Asia/Jerusalem:${firstDayMap[eventData.day]}T${
    hourCodeMap[eventData.hourCode + 1]
  }\n`;

  event += `RRULE:FREQ=WEEKLY;BYDAY=${eventData.day.substring(
    0,
    2
  )};INTERVAL=1\n`;
  event += `SUMMARY:${eventData.description.split("\n")[0]}\n`;
  event += "END:VEVENT\n";
  return event;
};

const getCalendarFile = (classes) => {
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
