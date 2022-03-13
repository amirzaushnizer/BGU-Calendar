import {numOfWeeksInSemester} from "../consts";
import {createClassEvent} from "./ics-helper";

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
        numOfWeeksInSemester
    };
}

export const parseCalendarHTML = (table) => {
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