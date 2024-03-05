import { VehicleAttributes } from "../../@types/types";
import { VehicleItem, VehicleItemType } from "./vehicle_item.mjs";
import { DaysContainer, DaysContainerType, Calendar } from "./days_container.mjs";
import { ScheduleContainer, ScheduleContainerType } from "./schedule_container.mjs";
import { ScheduleBarType } from "./schedule_bar.mjs";

window.accessToken.getAccessToken((accessToken: string) => {
    window.localStorage.setItem("accessToken", accessToken);
});

const accessToken = window.localStorage.getItem("accessToken");

const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class-select");
const previousMonthButton: HTMLDivElement = document.querySelector("#previous-month-button");
const nextMonthButton: HTMLDivElement = document.querySelector("#next-month-button");
const daysContainer: HTMLDivElement = document.querySelector("#days-container");
const vehicleItemsContainer: HTMLDivElement = document.querySelector("#vehicle-items-container");
const scheduleContainer: HTMLDivElement = document.querySelector("#schedule-container");

// Get the Date objects of 3 monthes.
const currentDate: Date = new Date();
const currentMonthDate: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
const previousMonthDate: Date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + DaysContainer.previousMonthDiff, 0);
const nextMonthDate: Date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + DaysContainer.nextMonthDiff, 0);

const totalDays: number = currentMonthDate.getDate() + previousMonthDate.getDate() + nextMonthDate.getDate();

const appendVehicleItems = async (vehicleAttributesArray?: VehicleAttributes[]) => {
    VehicleItem.instances.length = 0;

    if (vehicleAttributesArray) {
        const promises = vehicleAttributesArray.map(async (vehicleAttributes) => {
            const vehicleItemInstance: VehicleItemType = new VehicleItem(vehicleAttributes);
            vehicleItemInstance.createVehicleItem();

            const vehicleItem: HTMLDivElement = vehicleItemInstance.vehicleItem;
            vehicleItemsContainer.append(vehicleItem);

            await new Promise(requestAnimationFrame);

            return Promise.resolve();
        });

        await Promise.all(promises);
    }

    await new Promise((resolve: any): any => setTimeout(resolve, 100));
}

const appendScheduleContainers = (
    previousMonthDaysContainerInstance: DaysContainerType,
    currentMonthDaysContainerInstance: DaysContainerType,
    nextMonthDaysContainerInstance: DaysContainerType
): void => {
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
}

const calendarInitializer = async () => {
    const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributesByRentalClass({ accessToken: accessToken, rentalClass: rentalClassSelect.value });

    const previousMonthDaysContainerInstance: DaysContainerType = new DaysContainer(previousMonthDate, true);
    const currentMonthDaysContainerInstance: DaysContainerType = new DaysContainer(currentDate, true);
    const nextMonthDaysContainerInstance: DaysContainerType = new DaysContainer(nextMonthDate, true);

    await previousMonthDaysContainerInstance.createDaysContainer();
    await currentMonthDaysContainerInstance.createDaysContainer();
    await nextMonthDaysContainerInstance.createDaysContainer();

    const previousMonthDaysContainer: HTMLDivElement = previousMonthDaysContainerInstance.daysContainer;
    const currentMonthDaysContainer: HTMLDivElement = currentMonthDaysContainerInstance.daysContainer;
    const nextMonthDaysContainer: HTMLDivElement = nextMonthDaysContainerInstance.daysContainer;

    const appendDaysContainers = async (): Promise<void> => {
        for (const container of [
            previousMonthDaysContainer,
            currentMonthDaysContainer,
            nextMonthDaysContainer
        ]) {
            daysContainer.append(container);
        }
    }

    const handleInitialScrollPosition = (): void => {
        const previousDaysContainerWidth: number = previousMonthDaysContainer.getBoundingClientRect().width;
        const currentDaysContainerWidth: number = currentMonthDaysContainer.getBoundingClientRect().width;
        const nextDaysContainerWidth: number = nextMonthDaysContainer.getBoundingClientRect().width;
        const totalDaysContainerWidth: number = previousDaysContainerWidth + currentDaysContainerWidth + nextDaysContainerWidth;
        const dayWidth: number = totalDaysContainerWidth / totalDays;
        const todayPosition: number = ((previousMonthDate.getDate() + currentDate.getDate()) * dayWidth) - (dayWidth / 2);
        const daysContainerViewWidth: number = daysContainer.getBoundingClientRect().width;
        const centerPosition: number = todayPosition - (daysContainerViewWidth / 2);
        daysContainer.scrollLeft = centerPosition;
    }

    await appendDaysContainers();
    await appendVehicleItems(vehicleAttributesArray);

    appendScheduleContainers(
        previousMonthDaysContainerInstance,
        currentMonthDaysContainerInstance,
        nextMonthDaysContainerInstance
    );

    handleInitialScrollPosition();
}

const calendarUpdater = async () => {
    const currentScrollPositionX: number = scheduleContainer.scrollLeft;

    DaysContainer.calendars.forEach((calendar) => {
        const previousEventId: number = calendar.daysContainer.calendar.updateReservationEventId;
        window.removeEvent.wsUpdateReservationData(previousEventId);
    });

    while (vehicleItemsContainer.firstChild) {
        vehicleItemsContainer.removeChild(vehicleItemsContainer.firstChild);
    }

    const previousMonthScheduleContainer: HTMLDivElement = DaysContainer.calendars[0].scheduleContainer.scheduleContainer;
    const currentMonthScheduleContainer: HTMLDivElement = DaysContainer.calendars[1].scheduleContainer.scheduleContainer;
    const nextMonthScheduleContainer: HTMLDivElement = DaysContainer.calendars[2].scheduleContainer.scheduleContainer;

    while (previousMonthScheduleContainer.firstChild) {
        previousMonthScheduleContainer.removeChild(previousMonthScheduleContainer.firstChild);
    }

    while (currentMonthScheduleContainer.firstChild) {
        currentMonthScheduleContainer.removeChild(currentMonthScheduleContainer.firstChild);
    }

    while (nextMonthScheduleContainer.firstChild) {
        nextMonthScheduleContainer.removeChild(nextMonthScheduleContainer.firstChild);
    }

    const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributesByRentalClass({ accessToken: accessToken, rentalClass: rentalClassSelect.value });

    const previousMonthDaysContainerInstance: DaysContainerType = DaysContainer.calendars[0].daysContainer;
    const currentMonthDaysContainerInstance: DaysContainerType = DaysContainer.calendars[1].daysContainer;
    const nextMonthDaysContainerInstance: DaysContainerType = DaysContainer.calendars[2].daysContainer;

    await appendVehicleItems(vehicleAttributesArray);

    const newPreviousMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(previousMonthDaysContainerInstance);
    const newCurrentMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(currentMonthDaysContainerInstance);
    const newNextMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(nextMonthDaysContainerInstance);

    newPreviousMonthScheduleContainer.createScheduleContainer();
    newCurrentMonthScheduleContainer.createScheduleContainer();
    newNextMonthScheduleContainer.createScheduleContainer();

    const previousScheduleContainer: HTMLDivElement = newPreviousMonthScheduleContainer.scheduleContainer;
    const currentScheduleContainer: HTMLDivElement = newCurrentMonthScheduleContainer.scheduleContainer;
    const nextScheduleContainer: HTMLDivElement = newNextMonthScheduleContainer.scheduleContainer;

    previousMonthScheduleContainer.append(previousScheduleContainer);
    currentMonthScheduleContainer.append(currentScheduleContainer);
    nextMonthScheduleContainer.append(nextScheduleContainer);

    scheduleContainer.scrollLeft = currentScrollPositionX;
}

const handleDaysContainerScroll = (): void => {
    const scheduleContainerScrollLeft: number = scheduleContainer.scrollLeft;
    daysContainer.scrollLeft = scheduleContainerScrollLeft;

    if (scheduleContainerScrollLeft >= daysContainer.scrollLeft) {
        scheduleContainer.scrollLeft = daysContainer.scrollLeft;
    }
}

const handleVehicleItemsContainerScrollTop = (): void => {
    const scheduleContainerScrollTop: number = scheduleContainer.scrollTop;
    vehicleItemsContainer.scrollTop = scheduleContainerScrollTop;

    if (scheduleContainerScrollTop >= vehicleItemsContainer.scrollTop) {
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
    DaysContainer.nextMonthDiff--;
    const newPreviousMonthDate: Date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + DaysContainer.previousMonthDiff, 0);
    const newPreviousDaysContainerInstance: DaysContainerType = new DaysContainer(newPreviousMonthDate, false);
    await newPreviousDaysContainerInstance.createDaysContainer();
    const newPreviousDaysContainer: HTMLDivElement = newPreviousDaysContainerInstance.daysContainer;
    daysContainer.firstChild.before(newPreviousDaysContainer);

    const newPreviousScheduleContainerInstance: ScheduleContainerType = new ScheduleContainer(newPreviousDaysContainerInstance);
    await newPreviousScheduleContainerInstance.createScheduleContainer();
    const newPreviousMonthScheduleContainer: HTMLDivElement = newPreviousScheduleContainerInstance.scheduleContainer;
    scheduleContainer.firstChild.before(newPreviousMonthScheduleContainer);

    daysContainer.removeChild(daysContainer.lastChild);
    scheduleContainer.removeChild(scheduleContainer.lastChild);

    const removedElement: Calendar = DaysContainer.calendars.pop();
    const removedScheduleBars: ScheduleBarType[] = removedElement.scheduleContainer.scheduleBars;
    removedScheduleBars.forEach((scheduleBar: ScheduleBarType) => {
        const scheduleBarElement: HTMLDivElement = scheduleBar.scheduleBarElement;
        scheduleBarElement.removeEventListener("contextmenu", scheduleBar.displayContextmenu, false);
    });

    const updateReservationEventId: number = removedElement.daysContainer.calendar.updateReservationEventId;
    window.removeEvent.wsUpdateReservationData(updateReservationEventId);
}

const handleAppendNextMonthCalendar = async () => {
    DaysContainer.nextMonthDiff++;
    DaysContainer.previousMonthDiff++;
    const newNextMonthDate: Date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + DaysContainer.nextMonthDiff, 0);
    const newNextDaysContainerInstance: DaysContainerType = new DaysContainer(newNextMonthDate, true);
    await newNextDaysContainerInstance.createDaysContainer();
    const newNextDaysContainer: HTMLDivElement = newNextDaysContainerInstance.daysContainer;
    daysContainer.lastChild.after(newNextDaysContainer);

    const newNextScheduleContainerInstance: ScheduleContainerType = new ScheduleContainer(newNextDaysContainerInstance);
    await newNextScheduleContainerInstance.createScheduleContainer();
    const newNextScheduleContainer: HTMLDivElement = newNextScheduleContainerInstance.scheduleContainer;
    scheduleContainer.lastChild.after(newNextScheduleContainer);

    daysContainer.removeChild(daysContainer.firstChild);
    scheduleContainer.removeChild(scheduleContainer.firstChild);

    const removedElement: Calendar = DaysContainer.calendars.shift();
    const removedScheduleBars: ScheduleBarType[] = removedElement.scheduleContainer.scheduleBars;
    removedScheduleBars.forEach((scheduleBar: ScheduleBarType) => {
        const scheduleBarElement: HTMLDivElement = scheduleBar.scheduleBarElement;
        scheduleBarElement.removeEventListener("contextmenu", scheduleBar.displayContextmenu, false);
    });

    const updateReservationEventId: number = removedElement.daysContainer.calendar.updateReservationEventId;
    window.removeEvent.wsUpdateReservationData(updateReservationEventId);
}

(async (): Promise<void> => {
    const rentalClasses: string[] | null = await window.sqlSelect.rentalClasses({ accessToken: accessToken, selectedSmoking: "none-specification" });

    const allOption: HTMLOptionElement = document.createElement("option");
    allOption.textContent = "全て";

    if (rentalClasses) {
        rentalClasses.forEach((rentalClass: string) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.textContent = rentalClass;
            rentalClassSelect.append(option);
        });
    }

    rentalClassSelect.append(allOption);

    await calendarInitializer();
})();

rentalClassSelect.addEventListener("change", calendarUpdater, false);

scheduleContainer.addEventListener("scroll", handleDaysContainerScroll, false);
scheduleContainer.addEventListener("scroll", handleVehicleItemsContainerScrollTop, false);
daysContainer.addEventListener("scroll", handleScheduleContainerScrollX, false);
vehicleItemsContainer.addEventListener("scroll", handleScheduleContainerScrollY, false);

previousMonthButton.addEventListener("click", handleAppendPreviousMonthCalendar, false);
nextMonthButton.addEventListener("click", handleAppendNextMonthCalendar, false);

window.webSocket.updateVehicleAttributes(async () => {
    const selectedRentalClass: string = rentalClassSelect.value;
    const currentScrollPositionX: number = scheduleContainer.scrollLeft;
    const currentScrollPositionY: number = scheduleContainer.scrollTop;

    await calendarUpdater();

    rentalClassSelect.value = selectedRentalClass;
    scheduleContainer.scrollLeft = currentScrollPositionX;
    scheduleContainer.scrollTop = currentScrollPositionY;
});