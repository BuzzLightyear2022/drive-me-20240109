import { VehicleAttributes } from "../../@types/types";
import { getMonthName } from "../common_modules.mjs"
import { VehicleItem, VehicleItemType } from "./vehicle_item.mjs";
import { DaysContainer, DaysContainerType } from "./days_container.mjs";
import { ScheduleContainer, ScheduleContainerType } from "./schedule_container.mjs";

const windowContainer: HTMLDivElement = document.querySelector("#window-container");
const tableHeader: HTMLDivElement = document.querySelector("#table-header");
const monthDisplay: HTMLDivElement = document.querySelector("#month-display");
const daysContainer: HTMLDivElement = document.querySelector("#days-container");
const vehicleItemsContainer: HTMLDivElement = document.querySelector("#vehicle-items-container");
const scheduleContainer: HTMLDivElement = document.querySelector("#schedule-container");

let previousMonthDiff: number = -1;
let nextMonthDiff: number = 1;

// Get the Date objects of 3 monthes.
const currentDate: Date = new Date();
const firstDayOfCurrentDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
const previousMonthDate: Date = new Date(firstDayOfCurrentDate.getFullYear(), firstDayOfCurrentDate.getMonth() + previousMonthDiff, 0);
const nextMonthDate: Date = new Date(firstDayOfCurrentDate.getFullYear(), firstDayOfCurrentDate.getMonth() + nextMonthDiff, 0);

// Get the last date of 3 monthes.
const previousMonthDays: number = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth() + 1, 0).getDate();
const currentMonthDays: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const nextMonthDays: number = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0).getDate();

const totalDays: number = previousMonthDays + currentMonthDays + nextMonthDays;

const calendarInitializer = async (vehicleAttributesArray: VehicleAttributes[]) => {
    const previousMonthDaysContainerInstance: DaysContainerType = new DaysContainer(previousMonthDate);
    const currentMonthDaysContainerInstance: DaysContainerType = new DaysContainer(currentDate);
    const nextMonthDaysContainerInstance: DaysContainerType = new DaysContainer(nextMonthDate);

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

    const setDaysContainerObservers = async (): Promise<void> => {
        const getDateString = (date: Date): string => {
            const year: number = date.getFullYear();
            const monthIndex: number = date.getMonth();
            const month: string = getMonthName(monthIndex);
            const dateString = `${year}年${month}月`;
            return dateString;
        }

        const getWindowContainerPaddingLeft = (): number => {
            const tableHeaderWidth: number = tableHeader.getBoundingClientRect().width;
            const windowContainerStyle = window.getComputedStyle(windowContainer);
            const windowContainerPaddingLeft: number = Number(windowContainerStyle.paddingLeft.slice(0, -2));
            const offsetLeft: number = tableHeaderWidth + windowContainerPaddingLeft;

            return offsetLeft;
        }

        const displayMonthHandler = (entries: IntersectionObserverEntry[], daysContainerInstance: DaysContainerType): void => {
            entries.forEach(entry => {
                const epsilon: number = 1;

                const windowContainerPaddingLeft: number = getWindowContainerPaddingLeft();
                const leftScrollDiff: number = Math.abs(entry.intersectionRect.left - windowContainerPaddingLeft);

                if (entry.isIntersecting && leftScrollDiff < epsilon) {
                    const date: Date = daysContainerInstance.dateObject;
                    const dateString: string = getDateString(date);
                    monthDisplay.textContent = dateString;
                    monthDisplay.animate([
                        { transform: "translateX(200px)" },
                        { transform: "translateX(0px)" }
                    ],
                        {
                            duration: 300
                        }
                    )
                } else if (!entry.isIntersecting && entry.boundingClientRect.left < 0) {
                    const date: Date = daysContainerInstance.dateObject;
                    const nextMonthDate: Date = new Date(date.getFullYear(), date.getMonth() + 1);
                    const dateString: string = getDateString(nextMonthDate);
                    monthDisplay.textContent = dateString;
                    monthDisplay.animate([
                        { transform: "translateX(-200px)" },
                        { transform: "translateX(0px)" }
                    ],
                        {
                            duration: 300
                        }
                    );
                }
            });
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

(async (): Promise<void> => {
    const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributes();

    await calendarInitializer(vehicleAttributesArray);

    let isAppended: boolean = false;
    DaysContainer.calendars.forEach((calendar, index) => {
        const daysContainer: HTMLDivElement = calendar.daysContainer.daysContainer;
        const intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach(async (entry) => {
                if (index === 0 && entry.isIntersecting && !isAppended) {
                    previousMonthDiff--;
                    console.log(previousMonthDiff, previousMonthDate);
                    const newDaysContainerInstance: DaysContainerType = new DaysContainer(previousMonthDate);
                    await newDaysContainerInstance.createDaysContainer();
                    const newDaysContainer: HTMLDivElement = newDaysContainerInstance.daysContainer;

                    // daysContainer.before(newDaysContainer);

                    intersectionObserver.unobserve(daysContainer);
                    isAppended = true;
                }
            });
        });
        intersectionObserver.observe(daysContainer);
    });
})();

scheduleContainer.addEventListener("scroll", handleDaysContainerScroll, false);
scheduleContainer.addEventListener("scroll", handleVehicleItemsContainerScrollTop, false);
daysContainer.addEventListener("scroll", handleScheduleContainerScrollX, false);
vehicleItemsContainer.addEventListener("scroll", handleScheduleContainerScrollY, false);