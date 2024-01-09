import { VehicleAttributesItem } from "./vehicle_attributes_item.mjs";
import { MonthCalendar } from "./month_calendar.mjs";
import { VehicleAttributes, CalendarInfo } from "../../@types/types";
import { getMonthName } from "../common_modules.mjs";

const headerDiv: HTMLDivElement = document.querySelector("#header-div") as HTMLDivElement;
const vehicleAttributesItemContainer: HTMLDivElement = document.querySelector("#vehicle-attributes-item-container-div") as HTMLDivElement;
const calendarContainer: HTMLDivElement = document.querySelector("#calendar-container-div") as HTMLDivElement;
const vehicleScheduleContainer: HTMLDivElement = document.querySelector("#vehicle-schedule-container-div") as HTMLDivElement;

const currentMonthDiv: HTMLDivElement = document.createElement("div");
Object.assign(currentMonthDiv.style, {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    fontSize: "x-large",
    lineHeight: "200%"
});

// Get the Date objects of 3 monthes.
const currentDate: Date = new Date();
const previousMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
const nextMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);

// Get the last date of 3 monthes.
const previousMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
const currentMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const nextMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).getDate();
const totalDays: number = previousMonthDays + currentMonthDays + nextMonthDays;

headerDiv.append(currentMonthDiv);

const getTotalCalendarWidth = (): number => {
    const monthCalendars = calendarContainer.children;
    let totalWidth = 0;
    for (let i = 0; i < monthCalendars.length; i++) {
        const monthCalendar: Element = monthCalendars[i];
        totalWidth += monthCalendar.getBoundingClientRect().width;
    }
    return totalWidth;
}

const updateCurrentMonth = (args: {
    previousCalendarInfo: CalendarInfo,
    currentCalendarInfo: CalendarInfo,
    nextCalendarInfo: CalendarInfo
}) => {
    const { previousCalendarInfo, currentCalendarInfo, nextCalendarInfo } = args;

    const scrollPosition: number = calendarContainer.scrollLeft;

    const monthCalendars: HTMLCollection = calendarContainer.children;

    const totalCalendarWidth: number = getTotalCalendarWidth();
    const previousCalendarWidth: number = monthCalendars[0].getBoundingClientRect().width;
    const currentCalendarWidth: number = monthCalendars[1].getBoundingClientRect().width;
    const nextCalendarWidth: number = monthCalendars[2].getBoundingClientRect().width;

    const previousCalendarStart: number = totalCalendarWidth - previousCalendarWidth - currentCalendarWidth - nextCalendarWidth;
    const previousCalendarEnd: number = totalCalendarWidth - currentCalendarWidth - nextCalendarWidth;
    const currentCalendarEnd: number = totalCalendarWidth - nextCalendarWidth;

    if (scrollPosition >= previousCalendarStart && scrollPosition < previousCalendarEnd) {
        const previousCalendarYear = `${previousCalendarInfo.year}年`;
        const previousCalendarMonthIndex: number = previousCalendarInfo.monthIndex;
        const previousCalendarMonth: string = getMonthName({ monthIndex: previousCalendarMonthIndex });
        currentMonthDiv.textContent = `${previousCalendarYear}${previousCalendarMonth}`;
    } else if (scrollPosition > previousCalendarEnd && scrollPosition < currentCalendarEnd) {
        const currentCalendarYear = `${currentCalendarInfo.year}年`;
        const currentCalendarMonthIndex: number = currentCalendarInfo.monthIndex;
        const currentCalendarMonth: string = getMonthName({ monthIndex: currentCalendarMonthIndex });
        currentMonthDiv.textContent = `${currentCalendarYear}${currentCalendarMonth}`;
    } else if (scrollPosition > currentCalendarEnd && scrollPosition <= totalCalendarWidth) {
        const nextCalendarYear = `${nextCalendarInfo.year}年`;
        const nextCalendarMonthIndex: number = nextCalendarInfo.monthIndex;
        const nextCalendarMonth: string = getMonthName({ monthIndex: nextCalendarMonthIndex });
        currentMonthDiv.textContent = `${nextCalendarYear}${nextCalendarMonth}`;
    }
}

const handleVehicleScheduleScrollX = (): void => {
    const calendarContainerScrollLeft: number = calendarContainer.scrollLeft;
    vehicleScheduleContainer.scrollLeft = calendarContainerScrollLeft;
}

const handleVehicleScheduleScrollY = (): void => {
    const vehicleAttributesItemScrollTop: number = vehicleAttributesItemContainer.scrollTop;
    vehicleScheduleContainer.scrollTop = vehicleAttributesItemScrollTop;
}

const handleCalendarScroll = (): void => {
    const vehicleScheduleScrollLeft: number = vehicleScheduleContainer.scrollLeft;
    calendarContainer.scrollLeft = vehicleScheduleScrollLeft;
}

const handleVehicleAttributesItemScroll = (): void => {
    const vehicleScheduleScrollTop: number = vehicleScheduleContainer.scrollTop;
    vehicleAttributesItemContainer.scrollTop = vehicleScheduleScrollTop;
}

(async () => {
    const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributes();

    const previousMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: previousMonthDate });
    const currentMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: currentDate });
    const nextMonthCalendar = new MonthCalendar({ vehicleAttributesArray: vehicleAttributesArray, date: nextMonthDate });

    await Promise.all([
        previousMonthCalendar.initialize(),
        currentMonthCalendar.initialize(),
        nextMonthCalendar.initialize()
    ]);

    const totalCalendarWidth: number = getTotalCalendarWidth();

    const dayWidth: number = totalCalendarWidth / totalDays;
    const todayPosition: number = (previousMonthDays + currentDate.getDate()) * dayWidth;
    const containerWidth: number = vehicleScheduleContainer.getBoundingClientRect().width;
    const scrollToCenter: number = todayPosition - (containerWidth / 2);
    vehicleScheduleContainer.scrollLeft = scrollToCenter;

    const scrollHandler = () => {
        updateCurrentMonth({
            previousCalendarInfo: previousMonthCalendar.getCalendarInfo(),
            currentCalendarInfo: currentMonthCalendar.getCalendarInfo(),
            nextCalendarInfo: nextMonthCalendar.getCalendarInfo()
        });
    }

    scrollHandler();
    calendarContainer.addEventListener("scroll", scrollHandler, false);

    vehicleAttributesArray.forEach((vehicleAttributes: VehicleAttributes): void => {
        const vehicleAttributesItem = new VehicleAttributesItem({ vehicleAttributes: vehicleAttributes });
        vehicleAttributesItemContainer.append(vehicleAttributesItem);
    });

    vehicleAttributesItemContainer.addEventListener("scroll", handleVehicleScheduleScrollY);
    vehicleScheduleContainer.addEventListener("scroll", handleVehicleAttributesItemScroll);
    calendarContainer.addEventListener("scroll", handleVehicleScheduleScrollX);
    vehicleScheduleContainer.addEventListener("scroll", handleCalendarScroll);

    window.contextMenu.updateReservationData(() => {
        previousMonthCalendar.updateScheduleBars();
        currentMonthCalendar.updateScheduleBars();
        nextMonthCalendar.updateScheduleBars();
    });

    window.contextMenu.updateVehicleAttributes(() => {
        console.log("update vehicles")
        while (vehicleAttributesItemContainer.firstChild) {
            vehicleAttributesItemContainer.removeChild(vehicleAttributesItemContainer.firstChild);
        }
    });
})();
