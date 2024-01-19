import { VehicleAttributesItem } from "./vehicle_attributes_item.mjs";
import { MonthCalendar, MonthCalendarType, CalendarInfo } from "./month_calendar.mjs";
import { VehicleAttributes } from "../../@types/types";
import { getMonthName } from "../common_modules.mjs";

declare type CalendarObserver = {
    intersectionObserver: IntersectionObserver;
    monthCalendar: MonthCalendarType;
}

const windowContainer: HTMLDivElement = document.querySelector("#window-container-div");
const currentMonthDiv: HTMLDivElement = document.querySelector("#current-month-div");
const vehicleAttributesItemContainer: HTMLDivElement = document.querySelector("#vehicle-attributes-item-container-div");
const calendarContainer: HTMLDivElement = document.querySelector("#calendar-container-div");
const vehicleScheduleContainer: HTMLDivElement = document.querySelector("#vehicle-schedule-container-div");

const calendarObservers: CalendarObserver[] = [];

let previousMonthDiff: number = -1;
let currentMonthDiff: number = 0;
let nextMonthDiff: number = 1;

// Get the Date objects of 3 monthes.
const currentDateObject: Date = new Date();
const previousMonthDate: Date = new Date(currentDateObject.getFullYear(), currentDateObject.getMonth() + previousMonthDiff, currentDateObject.getDate());
const currentDate: Date = new Date(currentDateObject.getFullYear(), currentDateObject.getMonth() + currentMonthDiff, currentDateObject.getDate());
const nextMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + nextMonthDiff, currentDateObject.getDate());

// Get the last date of 3 monthes.
const previousMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + previousMonthDiff + 1, 0).getDate();
const currentMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + currentMonthDiff + 1, 0).getDate();
const nextMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + nextMonthDiff + 1, 0).getDate();
const totalDays: number = previousMonthDays + currentMonthDays + nextMonthDays;

const getTotalCalendarWidth = (): number => {
    const monthCalendars = calendarContainer.children;
    let totalWidth = 0;
    for (let i = 0; i < monthCalendars.length; i++) {
        const monthCalendar: Element = monthCalendars[i];
        totalWidth += monthCalendar.getBoundingClientRect().width;
    }
    return totalWidth;
}

const calendarObserver = (vehicleAttributesArray: VehicleAttributes[]) => {
    monthCalendars.forEach((monthCalendar: MonthCalendarType, index: number): void => {
        const monthCalendarInfo: CalendarInfo = monthCalendar.getCalendarInfo();
        const monthCalendarDiv: HTMLDivElement = monthCalendarInfo.monthScheduleContainer;

        const calendarObserver: IntersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                handleCurrentMonthDisplay({ entry: entry, calendarInfo: monthCalendarInfo });
            });

            if (index === 0) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        calendarObservers.pop();
                        handleAddPreviousMonthCalendar(vehicleAttributesArray);
                        calendarObservers.unshift(calendarObserver);
                    }
                });
            }
        });
        
        calendarObservers.push(calendarObserver);
        calendarObserver.observe(monthCalendarDiv);
    });
}

const handleInitialScrollPosition = (): void => {
    const totalCalendarWidth: number = getTotalCalendarWidth();
    const dayWidth: number = totalCalendarWidth / totalDays;
    const todayPosition: number = (previousMonthDays + currentDate.getDate()) * dayWidth;
    const containerWidth: number = vehicleScheduleContainer.getBoundingClientRect().width;
    const scrollToCenter: number = todayPosition - (containerWidth / 2);
    vehicleScheduleContainer.scrollLeft = scrollToCenter;
}

const handleCurrentMonthDisplay = (args: { entry: IntersectionObserverEntry, calendarInfo: CalendarInfo }) => {
    const { entry, calendarInfo } = args;

    const vehicleAttributesItemContainerWidth: number = vehicleAttributesItemContainer.getBoundingClientRect().width;
    const windowContainerOffsetLeft: number = Number(window.getComputedStyle(windowContainer).paddingLeft.slice(0, -2));
    const edgeOfVehicleAttributesItemContainer: number = windowContainerOffsetLeft + vehicleAttributesItemContainerWidth;

    if (entry.isIntersecting && entry.boundingClientRect.left < 0) {
        const month: string = getMonthName(calendarInfo.monthIndex);
        const text = `${calendarInfo.year}年${month}`;
        currentMonthDiv.textContent = text;
    } else if (!entry.isIntersecting && entry.boundingClientRect.left < edgeOfVehicleAttributesItemContainer) {
        const currentCalendarDateObject: Date = calendarInfo.dateObject;
        const previousMonth: Date = new Date(currentCalendarDateObject.getFullYear(), currentCalendarDateObject.getMonth() + 1);
        const month: string = getMonthName(previousMonth.getMonth());
        const text = `${previousMonth.getFullYear()}年${month}`;
        currentMonthDiv.textContent = text;
    }
}

const calendarInitializer = async (vehicleAttributesArray: VehicleAttributes[]) => {
    const previousMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: previousMonthDate, addNext: true });
    const currentMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: currentDate, addNext: true });
    const nextMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: nextMonthDate, addNext: true });

    monthCalendars.push(previousMonthCalendar, currentMonthCalendar, nextMonthCalendar);

    monthCalendars.forEach(async monthCalendar => {
        await monthCalendar.appendCalendar();
    });

    window.contextMenu.updateReservationData(() => {
        monthCalendars.forEach(monthCalendar => {
            monthCalendar.updateScheduleBars();
        });
    });

    handleInitialScrollPosition();

    calendarObserver(vehicleAttributesArray);
}

const handleAddPreviousMonthCalendar = async (vehicleAttributesArray: VehicleAttributes[]): Promise<void> => {
    calendarContainer.removeChild(calendarContainer.lastChild);
    vehicleScheduleContainer.removeChild(vehicleScheduleContainer.lastChild);

    monthCalendars.pop();

    previousMonthDiff--;
    const newPreviousMonthDate: Date = new Date(currentDateObject.getFullYear(), currentDateObject.getMonth() + previousMonthDiff, currentDateObject.getDate());
    const newPreviousMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: newPreviousMonthDate, addNext: false });
    const newPreviousMonthCalendarInfo: CalendarInfo = newPreviousMonthCalendar.getCalendarInfo();

    monthCalendars.unshift(newPreviousMonthCalendar);
    await newPreviousMonthCalendar.appendCalendar();

    calendarObserver(vehicleAttributesArray);

    console.log(calendarObservers);
}

const handleCalendarContainerScroll = (): void => {
    const vehicleScheduleScrollLeft: number = vehicleScheduleContainer.scrollLeft;
    const calendarContainerScrollLeft: number = calendarContainer.scrollLeft;
    calendarContainer.scrollLeft = vehicleScheduleScrollLeft;
    if (vehicleScheduleScrollLeft >= calendarContainerScrollLeft) {
        vehicleScheduleContainer.scrollLeft = calendarContainerScrollLeft;
    }
}

const handleVehicleAttributesItemScroll = (): void => {
    const vehicleScheduleContainerScrollTop: number = vehicleScheduleContainer.scrollTop;
    const vehicleAttributesItemContainerScrollTop: number = vehicleAttributesItemContainer.scrollTop;
    vehicleAttributesItemContainer.scrollTop = vehicleScheduleContainerScrollTop;
    if (vehicleScheduleContainerScrollTop >= vehicleAttributesItemContainerScrollTop) {
        vehicleScheduleContainer.scrollTop = vehicleAttributesItemContainerScrollTop;
    }
}

const handleVehicleScheduleScrollY = (): void => {
    const vehicleAttributesItemScrollTop: number = vehicleAttributesItemContainer.scrollTop;
    vehicleScheduleContainer.scrollTop = vehicleAttributesItemScrollTop;
}

const handleVehicleScheduleScrollX = async (): Promise<void> => {
    const calendarContainerWidth: number = getTotalCalendarWidth();
    // visible area.
    const vehicleScheduleContainerWidth: number = vehicleScheduleContainer.getBoundingClientRect().width;

    // scroll control.
    const calendarContainerScrollLeft: number = calendarContainer.scrollLeft;
    vehicleScheduleContainer.scrollLeft = calendarContainerScrollLeft;

    // change view of current year and month display.
    // const previousMonthCalendarDiv = previousMonthCalendar.getCalendarInfo().innerVehicleScheduleContainer;
    // const currentMonthCalendarDiv = currentMonthCalendar.getCalendarInfo().innerVehicleScheduleContainer;
    // const nextMonthCalendarDiv = nextMonthCalendar.getCalendarInfo().innerVehicleScheduleContainer;

    // const previousMonthObserver = createMonthObserver({ monthCalendarInfo: previousMonthCalendar.getCalendarInfo(), monthCalendarDiv: previousMonthCalendarDiv });
    // const currentMonthObserver = createMonthObserver({ monthCalendarInfo: currentMonthCalendar.getCalendarInfo(), monthCalendarDiv: currentMonthCalendarDiv });
    // const nextMonthObserver = createMonthObserver({ monthCalendarInfo: nextMonthCalendar.getCalendarInfo(), monthCalendarDiv: nextMonthCalendarDiv });

    // previousMonthObserver.observe(previousMonthCalendarDiv);
    // currentMonthObserver.observe(currentMonthCalendarDiv,);
    // nextMonthObserver.observe(nextMonthCalendarDiv);

    // handle add next month calendars.
    if (calendarContainerWidth - calendarContainerScrollLeft - vehicleScheduleContainerWidth < 1) {
        // handleAddNextMonthCalendar(vehicleAttributesArray);
    }

    // const newNextMonthCalendarObserver: IntersectionObserver = createMonthObserver({
    // monthCalendarInfo: nextMonthCalendarInfo,
    // monthCalendarDiv: nextMonthCalendarInfo.innerVehicleScheduleContainer
    // });
    // newNextMonthCalendarObserver.observe(nextMonthCalendarInfo.innerVehicleScheduleContainer);

    // handle add previous month calendars.
    // await handleAddPreviousMonthCalendar(vehicleAttributesArray);
    // calendarContainer.scrollLeft = previousMonthCalendarInfo.innerVehicleScheduleContainer.getBoundingClientRect().width;

    // const newPreviousCalendarObserver: IntersectionObserver = createMonthObserver({
    // monthCalendarInfo: previousMonthCalendarInfo,
    // monthCalendarDiv: previousMonthCalendarInfo.innerVehicleScheduleContainer
    // });
    // newPreviousCalendarObserver.observe(previousMonthCalendarInfo.innerVehicleScheduleContainer);
}

const handleAddNextMonthCalendar = async (vehicleAttributesArray: VehicleAttributes[]): Promise<void> => {
    nextMonthDiff++;
    previousMonthDiff++;

    calendarContainer.removeChild(calendarContainer.firstChild);
    vehicleScheduleContainer.removeChild(vehicleScheduleContainer.firstChild);

    const nextMonthDate: Date = new Date(currentDateObject.getFullYear(), currentDateObject.getMonth() + nextMonthDiff, currentDateObject.getDate());
    const newNextMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: nextMonthDate, addNext: true });
    // nextMonthCalendarInfo = newNextMonthCalendar.getCalendarInfo();

    window.contextMenu.updateReservationData(() => {
        newNextMonthCalendar.updateScheduleBars();
    });

    // const newNextMonth: string = getMonthName({ monthIndex: nextMonthCalendarInfo.monthIndex });
    // currentMonthDiv.textContent = `${nextMonthCalendarInfo.year}年${newNextMonth}`;
}

(async () => {
    const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributes();

    vehicleAttributesArray.forEach((vehicleAttributes: VehicleAttributes): void => {
        const vehicleAttributesItem = new VehicleAttributesItem({ vehicleAttributes: vehicleAttributes });
        vehicleAttributesItemContainer.append(vehicleAttributesItem);
    });

    await calendarInitializer(vehicleAttributesArray);
})();

vehicleAttributesItemContainer.addEventListener("scroll", handleVehicleScheduleScrollY, false);
vehicleScheduleContainer.addEventListener("scroll", handleVehicleAttributesItemScroll, false);
calendarContainer.addEventListener("scroll", handleVehicleScheduleScrollX, false);
vehicleScheduleContainer.addEventListener("scroll", handleCalendarContainerScroll, false);