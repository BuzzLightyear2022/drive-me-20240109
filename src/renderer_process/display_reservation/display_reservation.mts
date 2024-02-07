import { VehicleAttributes } from "../../@types/types";
import { VehicleItem, VehicleItemType } from "./vehicle_item.mjs";
import { DaysContainer, DaysContainerType } from "./days_container.mjs";
import { ScheduleContainer, ScheduleContainerType } from "./schedule_container.mjs";

const previousMonthButton: HTMLDivElement = document.querySelector("#previous-month-button");
const nextMonthButton: HTMLDivElement = document.querySelector("#next-month-button");
const daysContainer: HTMLDivElement = document.querySelector("#days-container");
const vehicleItemsContainer: HTMLDivElement = document.querySelector("#vehicle-items-container");
const scheduleContainer: HTMLDivElement = document.querySelector("#schedule-container");

// Get the Date objects of 3 monthes.
const currentDate: Date = new Date();
const lastDateOfPreviousMonth: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
const previousMonthDate: Date = new Date(lastDateOfPreviousMonth.getFullYear(), lastDateOfPreviousMonth.getMonth() + DaysContainer.previousMonthDiff, 0);
const nextMonthDate: Date = new Date(lastDateOfPreviousMonth.getFullYear(), lastDateOfPreviousMonth.getMonth() + DaysContainer.nextMonthDiff, 0);

// Get the last date of 3 monthes.
const previousMonthDays: number = lastDateOfPreviousMonth.getDate();
const currentMonthDays: number = previousMonthDate.getDate();
const nextMonthDays: number = nextMonthDate.getDate();

const totalDays: number = previousMonthDays + currentMonthDays + nextMonthDays;

const calendarInitializer = async (vehicleAttributesArray: VehicleAttributes[]) => {
    const previousMonthDaysContainerInstance: DaysContainerType = new DaysContainer(previousMonthDate, false);
    const currentMonthDaysContainerInstance: DaysContainerType = new DaysContainer(currentDate, false);
    const nextMonthDaysContainerInstance: DaysContainerType = new DaysContainer(nextMonthDate, false);

    await previousMonthDaysContainerInstance.createDaysContainer();
    await currentMonthDaysContainerInstance.createDaysContainer();
    await nextMonthDaysContainerInstance.createDaysContainer();

    const previousMonthDaysContainer: HTMLDivElement = previousMonthDaysContainerInstance.daysContainer;
    const currentMonthDaysContainer: HTMLDivElement = currentMonthDaysContainerInstance.daysContainer;
    const nextMonthDaysContainer: HTMLDivElement = nextMonthDaysContainerInstance.daysContainer;

    const previousMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(previousMonthDaysContainerInstance);
    const currentMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(currentMonthDaysContainerInstance);
    const nextMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(nextMonthDaysContainerInstance);

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
        previousMonthScheduleContainer.createScheduleContainer();
        currentMonthScheduleContainer.createScheduleContainer();
        nextMonthScheduleContainer.createScheduleContainer();

        const previousScheduleContainer: HTMLDivElement = previousMonthScheduleContainer.scheduleContainer;
        const currentScheduleContainer: HTMLDivElement = currentMonthScheduleContainer.scheduleContainer;
        const nextScheduleContainer: HTMLDivElement = nextMonthScheduleContainer.scheduleContainer;

        scheduleContainer.append(previousScheduleContainer, currentScheduleContainer, nextScheduleContainer);

        await new Promise(resolve => setTimeout(resolve, 0));
    }

    const handleInitialScrollPosition = (): void => {
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
    handleInitialScrollPosition();
}

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

const handleAppendPreviousMonthCalendar = async () => {
    DaysContainer.previousMonthDiff--;
    const newPreviousMonthDate: Date = new Date(lastDateOfPreviousMonth.getFullYear(), lastDateOfPreviousMonth.getMonth() + DaysContainer.previousMonthDiff, 0);
    const newPreviousDaysContainerInstance: DaysContainerType = new DaysContainer(newPreviousMonthDate);
    await newPreviousDaysContainerInstance.createDaysContainer();
    const newPreviousDaysContainer: HTMLDivElement = newPreviousDaysContainerInstance.daysContainer;
    daysContainer.firstChild.before(newPreviousDaysContainer);

    const newPreviousScheduleContainerInstance: ScheduleContainerType = new ScheduleContainer(newPreviousDaysContainerInstance);
    await newPreviousScheduleContainerInstance.createScheduleContainer();
    const newPreviousMonthScheduleContainer: HTMLDivElement = newPreviousScheduleContainerInstance.scheduleContainer;
    scheduleContainer.firstChild.before(newPreviousMonthScheduleContainer);

    daysContainer.removeChild(daysContainer.lastChild);
    scheduleContainer.removeChild(scheduleContainer.lastChild);

    DaysContainer.calendars.pop();

    daysContainer.scrollLeft = 0;
}

const handleAppendNextMonthCalendar = async () => {
    DaysContainer.nextMonthDiff++;
    const newNextMonthDate: Date = new Date(lastDateOfPreviousMonth.getFullYear(), lastDateOfPreviousMonth.getMonth() + DaysContainer.nextMonthDiff, 0);
    const newNextDaysContainerInstance: DaysContainerType = new DaysContainer(newNextMonthDate);
    await newNextDaysContainerInstance.createDaysContainer();
    const newNextDaysContainer: HTMLDivElement = newNextDaysContainerInstance.daysContainer;
    daysContainer.lastChild.after(newNextDaysContainer);

    const newNextScheduleContainerInstance: ScheduleContainerType = new ScheduleContainer(newNextDaysContainerInstance);
    await newNextScheduleContainerInstance.createScheduleContainer();
    const newNextScheduleContainer: HTMLDivElement = newNextScheduleContainerInstance.scheduleContainer;
    scheduleContainer.lastChild.after(newNextScheduleContainer);

    daysContainer.removeChild(daysContainer.firstChild);
    scheduleContainer.removeChild(scheduleContainer.firstChild);

    DaysContainer.calendars.shift();
}

(async (): Promise<void> => {
    const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributes();
    await calendarInitializer(vehicleAttributesArray);
})();

scheduleContainer.addEventListener("scroll", handleDaysContainerScroll, false);
scheduleContainer.addEventListener("scroll", handleVehicleItemsContainerScrollTop, false);
daysContainer.addEventListener("scroll", handleScheduleContainerScrollX, false);
vehicleItemsContainer.addEventListener("scroll", handleScheduleContainerScrollY, false);

previousMonthButton.addEventListener("click", handleAppendPreviousMonthCalendar, false);
nextMonthButton.addEventListener("click", handleAppendNextMonthCalendar, false);