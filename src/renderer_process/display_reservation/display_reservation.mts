import { VehicleAttributes } from "../../@types/types";
import { VehicleItem, VehicleItemType } from "./vehicle_item.mjs";
import { DaysContainer, DaysContainerType } from "./days_container.mjs";
import { ScheduleContainer, ScheduleContainerType } from "./schedule_container.mjs";

const daysContainer: HTMLDivElement = document.querySelector("#days-container");
const vehicleItemsContainer: HTMLDivElement = document.querySelector("#vehicle-items-container");
const scheduleContainer: HTMLDivElement = document.querySelector("#schedule-container");

let previousMonthDiff: number = -1;
let nextMonthDiff: number = 1;

// Get the Date objects of 3 monthes.
const currentDate: Date = new Date();
const previousMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + previousMonthDiff, currentDate.getDate());
const nextMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + nextMonthDiff, currentDate.getDate());

// Get the last date of 3 monthes.
const previousMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + previousMonthDiff + 1, 0).getDate();
const currentMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const nextMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + nextMonthDiff + 1, 0).getDate();

const totalDays: number = previousMonthDays + currentMonthDays + nextMonthDays;

const calendarInitializer = async (vehicleAttributesArray: VehicleAttributes[]) => {
    const previousMonthDaysContainerInstance: DaysContainerType = new DaysContainer(previousMonthDate);
    const currentMonthDaysContainerInstance: DaysContainerType = new DaysContainer(currentDate);
    const nextMonthDaysContainerInstance: DaysContainerType = new DaysContainer(nextMonthDate);

    previousMonthDaysContainerInstance.createDaysContainer();
    currentMonthDaysContainerInstance.createDaysContainer();
    nextMonthDaysContainerInstance.createDaysContainer();

    const previousMonthDaysContainer: HTMLDivElement = previousMonthDaysContainerInstance.daysContainer;
    const currentMonthDaysContainer: HTMLDivElement = currentMonthDaysContainerInstance.daysContainer;
    const nextMonthDaysContainer: HTMLDivElement = nextMonthDaysContainerInstance.daysContainer;

    const appendVehicleItems = async (): Promise<void> => {
        for (const vehicleAttributes of vehicleAttributesArray) {
            const vehicleItemInstance: VehicleItemType = new VehicleItem(vehicleAttributes);
            vehicleItemInstance.createVehicleItem();

            const vehicleItem: HTMLDivElement = vehicleItemInstance.vehicleItem;
            vehicleItemsContainer.append(vehicleItem);

            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    const appendDaysContainers = async (): Promise<void> => {
        for (const container of [
            previousMonthDaysContainer,
            currentMonthDaysContainer,
            nextMonthDaysContainer
        ]) {
            daysContainer.append(container);
        }
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    const appendScheduleContainers = async (): Promise<void> => {
        const previousMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(previousMonthDaysContainerInstance);
        const currentMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(currentMonthDaysContainerInstance);
        const nextMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(nextMonthDaysContainerInstance);

        previousMonthScheduleContainer.createScheduleContainer();
        currentMonthScheduleContainer.createScheduleContainer();
        nextMonthScheduleContainer.createScheduleContainer();

        const previousScheduleContainer: HTMLDivElement = previousMonthScheduleContainer.scheduleContainer;
        const currentScheduleContainer: HTMLDivElement = currentMonthScheduleContainer.scheduleContainer;
        const nextScheduleContainer: HTMLDivElement = nextMonthScheduleContainer.scheduleContainer;

        scheduleContainer.append(previousScheduleContainer, currentScheduleContainer, nextScheduleContainer);

        await new Promise(resolve => setTimeout(resolve, 0));
    }

    const handleInitialScrollPosition = async (): Promise<void> => {
        const previousDaysContainerWidth: number = previousMonthDaysContainer.getBoundingClientRect().width;
        const currentDaysContainerWidth: number = currentMonthDaysContainer.getBoundingClientRect().width;
        const nextDaysContainerWidth: number = nextMonthDaysContainer.getBoundingClientRect().width;

        const totalDaysContainerWidth: number = previousDaysContainerWidth + currentDaysContainerWidth + nextDaysContainerWidth;

        const daysContainerWidth: number = totalDaysContainerWidth;
        const dayWidth: number = daysContainerWidth / totalDays;
        const todayPosition: number = ((previousMonthDays + currentDate.getDate()) * dayWidth) - (dayWidth / 2);
        const daysContainerViewWidth: number = daysContainer.getBoundingClientRect().width;
        const centerPosition: number = todayPosition - (daysContainerViewWidth / 2);
        daysContainer.scrollLeft = centerPosition;
    }

    await appendVehicleItems();
    await appendDaysContainers();
    await appendScheduleContainers();

    console.log(DaysContainer.calendars);

    handleInitialScrollPosition();
}

(async (): Promise<void> => {
    const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributes();

    calendarInitializer(vehicleAttributesArray);
})();

const handleDaysContainerScroll = (): void => {
    const scheduleContainerScrollLeft: number = scheduleContainer.scrollLeft;
    daysContainer.scrollLeft = scheduleContainerScrollLeft;

    if (scheduleContainerScrollLeft > daysContainer.scrollLeft) {
        scheduleContainer.scrollLeft = daysContainer.scrollLeft;
    }
}

const handleVehicleItemsContainerScrollTop = (): void => {
    const scheduleContainerScrollTop: number = scheduleContainer.scrollTop;
    vehicleItemsContainer.scrollTop = scheduleContainerScrollTop;

    if (scheduleContainerScrollTop > vehicleItemsContainer.scrollTop) {
        scheduleContainer.scrollTop = vehicleItemsContainer.scrollTop;
    }
}

const handleScheduleContainerScrollX = (): void => {
    const daysContainerScrollLeft: number = daysContainer.scrollLeft;
    scheduleContainer.scrollLeft = daysContainerScrollLeft;
}

const handleScheduleContainerScrollY = (): void => {
    const vehicleItemsContainerScrollTop: number = vehicleItemsContainer.scrollTop;
    scheduleContainer.scrollTop = vehicleItemsContainerScrollTop;
}

scheduleContainer.addEventListener("scroll", handleDaysContainerScroll, false);
scheduleContainer.addEventListener("scroll", handleVehicleItemsContainerScrollTop, false);
daysContainer.addEventListener("scroll", handleScheduleContainerScrollX, false);
vehicleItemsContainer.addEventListener("scroll", handleScheduleContainerScrollY, false);

// const handleVehicleScheduleScrollX = async (): Promise<void> => {
//     // const calendarContainerWidth: number = getTotalCalendarWidth();
//     // visible area.
//     const vehicleScheduleContainerWidth: number = vehicleScheduleContainer.getBoundingClientRect().width;

//     // scroll control.
//     const calendarContainerScrollLeft: number = calendarContainer.scrollLeft;
//     vehicleScheduleContainer.scrollLeft = calendarContainerScrollLeft;

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
// if (calendarContainerWidth - calendarContainerScrollLeft - vehicleScheduleContainerWidth < 1) {
// handleAddNextMonthCalendar(vehicleAttributesArray);
// }

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
// }