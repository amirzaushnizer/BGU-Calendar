import {createCalendarFile} from "./helpers/ics-helper";
import {download} from "./helpers/download-helper";
import {parseCalendarHTML} from "./helpers/calendar-html-parser";


const getCalendarFileStr = (table) => {
  const classEvents = parseCalendarHTML(table);
  return createCalendarFile(classEvents);
}

const clickOnDownload = (e) => {
  e.preventDefault();

  const table = getCalendarTable();
  const calendarFileStr = getCalendarFileStr(table);
  download('bgu_calendar.ics', calendarFileStr)
};

const getCalendarTable = () => {
  return [...document.querySelector(".standardLook").children[0].children];
};


/*
  main script
 */
const title = document.querySelector(".uRegionHeading");
const isHourTablePage = title && title.textContent.includes("מערכת שעות");

const createDownloadButton = () => {
  const btn = document.createElement("button");
  btn.addEventListener("click", clickOnDownload);
  btn.innerHTML = "הורד מערכת שעות";
  return btn;
}

if (isHourTablePage) {
  const actionBar = document.getElementsByClassName(
    "uRegionContent clearfix"
  )[0];
  if (actionBar) {
    const btn = createDownloadButton();
    actionBar.appendChild(btn);
  }
}

