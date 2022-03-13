import {firstDayMap, hourCodeMap} from "../consts";

export const createClassEvent = (eventData) => {
    let event = "BEGIN:VEVENT\n";
    event += `DTSTART;TZID=Asia/Jerusalem:${firstDayMap[eventData.day]}T${
        hourCodeMap[eventData.hourCode]
    }\n`;

    event += `DTEND;TZID=Asia/Jerusalem:${firstDayMap[eventData.day]}T${
        hourCodeMap[eventData.hourCode + 1]
    }\n`;

    event += `RRULE:FREQ=WEEKLY;BYDAY=${eventData.day.substring(0, 2)};INTERVAL=1;COUNT=${eventData.numOfWeeksInSemester}\n`;
    event += `SUMMARY:${eventData.description.split("\n")[0]}\n`;
    event += "END:VEVENT\n";
    return event;
};

export const createCalendarFile = (classes) => {
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