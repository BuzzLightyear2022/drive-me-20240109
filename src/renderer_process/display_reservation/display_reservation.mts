import { RentalCar, VehicleStatus } from "../../@types/types";
import { RentalCarItem } from "./rentalCar_item.mjs";
import { CalendarDate } from "./calendar_date.mjs";
// import { Days, DaysContainerType, Calendar } from "./calendar_date.mjs";
import { VisualSchedule } from "./visual_schedule.mjs";

const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class-select");
const previousMonthButton: HTMLDivElement = document.querySelector("#previous-month-button");
const nextMonthButton: HTMLDivElement = document.querySelector("#next-month-button");
const dateContainer: HTMLDivElement = document.querySelector("#date-container");
const vehicleItemsContainer: HTMLDivElement = document.querySelector("#vehicle-items-container");
const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");

const appendRentalClassOptions = async (): Promise<void> => {
    const existingRentalClasses: string[] | null = await window.sqlSelect.existingRentalClasses({});
    if (existingRentalClasses) {
        await Promise.all(existingRentalClasses.map((rentalClass: string) => {
            const rentalClassOption: HTMLOptionElement = document.createElement("option");
            rentalClassOption.textContent = rentalClass;
            rentalClassSelect.append(rentalClassOption);
        }));
    }
}

const appendRentalCarItems = async (): Promise<void> => {
    const rentalCars: RentalCar[] = await window.sqlSelect.rentalCars({ rentalClass: rentalClassSelect.value });

    if (rentalCars) {
        await Promise.all(rentalCars.map((rentalCar: RentalCar) => {
            const rentalCarItem: HTMLElement = new RentalCarItem({ rentalCar: rentalCar });
            vehicleItemsContainer.append(rentalCarItem);
        }));
    }
}

const appendCalendarDateElements = async (): Promise<void> => {
    const currentDate: Date = new Date();
    const currentYear: number = currentDate.getFullYear();
    const currentMonthIndex: number = currentDate.getMonth();

    const previousMonthDate: Date = new Date(currentYear, currentMonthIndex, 0);
    const nextMonthDate: Date = new Date(currentYear, currentMonthIndex + 2, 0);

    const previousMonthCalendarDate: CalendarDate = new CalendarDate({ dateObject: previousMonthDate });
    const currentMonthCalendarDate: CalendarDate = new CalendarDate({ dateObject: currentDate });
    const nextMonthCalendarDate: CalendarDate = new CalendarDate({ dateObject: nextMonthDate });

    dateContainer.append(previousMonthCalendarDate, currentMonthCalendarDate, nextMonthCalendarDate);

    await new Promise((resolve) => { setTimeout(resolve, 500) });
}

const appendVisualSchedule = (): void => {
    const calendarDateElements: NodeListOf<Element> = document.querySelectorAll("calendar-date");

    const previousMonthDateElement: Element = calendarDateElements[0];
    const currentMonthDateElement: Element = calendarDateElements[1];
    const nextMonthDateElement: Element = calendarDateElements[2];

    const previousMonthVisualSchedule: HTMLElement = new VisualSchedule({ calendarDateElement: previousMonthDateElement });
    const currentMonthVisualSchedule: HTMLElement = new VisualSchedule({ calendarDateElement: currentMonthDateElement });
    const nextMonthVisualSchedule: HTMLElement = new VisualSchedule({ calendarDateElement: nextMonthDateElement });

    visualScheduleContainer.append(previousMonthVisualSchedule, currentMonthVisualSchedule, nextMonthVisualSchedule);
}

const calendarInitializer = async () => {

    // const previousMonthDaysContainerInstance: DaysContainerType = new DaysContainer(previousMonthDate, true);
    // const currentMonthDaysContainerInstance: DaysContainerType = new DaysContainer(currentDate, true);
    // const nextMonthDaysContainerInstance: DaysContainerType = new DaysContainer(nextMonthDate, true);

    // await previousMonthDaysContainerInstance.createDaysContainer();
    // await currentMonthDaysContainerInstance.createDaysContainer();
    // await nextMonthDaysContainerInstance.createDaysContainer();

    // const previousMonthDaysContainer: HTMLDivElement = previousMonthDaysContainerInstance.daysContainer;
    // const currentMonthDaysContainer: HTMLDivElement = currentMonthDaysContainerInstance.daysContainer;
    // const nextMonthDaysContainer: HTMLDivElement = nextMonthDaysContainerInstance.daysContainer;

    // const appendDaysContainers = async (): Promise<void> => {
    //     for (const container of [
    //         previousMonthDaysContainer,
    //         currentMonthDaysContainer,
    //         nextMonthDaysContainer
    //     ]) {
    //         daysContainer.append(container);
    //     }
    // }

    // const handleInitialScrollPosition = (): void => {
    //     const previousDaysContainerWidth: number = previousMonthDaysContainer.getBoundingClientRect().width;
    //     const currentDaysContainerWidth: number = currentMonthDaysContainer.getBoundingClientRect().width;
    //     const nextDaysContainerWidth: number = nextMonthDaysContainer.getBoundingClientRect().width;
    //     const totalDaysContainerWidth: number = previousDaysContainerWidth + currentDaysContainerWidth + nextDaysContainerWidth;
    //     const dayWidth: number = totalDaysContainerWidth / totalDays;
    //     const todayPosition: number = ((previousMonthDate.getDate() + currentDate.getDate()) * dayWidth) - (dayWidth / 2);
    //     const daysContainerViewWidth: number = daysContainer.getBoundingClientRect().width;
    //     const centerPosition: number = todayPosition - (daysContainerViewWidth / 2);
    //     daysContainer.scrollLeft = centerPosition;
    // }

    // await appendDaysContainers();
    // await appendVehicleItems(vehicleAttributesArray);

    // appendScheduleContainers(
    //     previousMonthDaysContainerInstance,
    //     currentMonthDaysContainerInstance,
    //     nextMonthDaysContainerInstance
    // );

    // handleInitialScrollPosition();

    // vehicleStatusHandler();
}

// const appendScheduleContainers = (
//     previousMonthDaysContainerInstance: DaysContainerType,
//     currentMonthDaysContainerInstance: DaysContainerType,
//     nextMonthDaysContainerInstance: DaysContainerType
// ): void => {
//     const previousMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(previousMonthDaysContainerInstance);
//     const currentMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(currentMonthDaysContainerInstance);
//     const nextMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(nextMonthDaysContainerInstance);

//     previousMonthScheduleContainer.createScheduleContainer();
//     currentMonthScheduleContainer.createScheduleContainer();
//     nextMonthScheduleContainer.createScheduleContainer();

//     const previousScheduleContainer: HTMLDivElement = previousMonthScheduleContainer.scheduleContainer;
//     const currentScheduleContainer: HTMLDivElement = currentMonthScheduleContainer.scheduleContainer;
//     const nextScheduleContainer: HTMLDivElement = nextMonthScheduleContainer.scheduleContainer;

//     scheduleContainer.append(previousScheduleContainer, currentScheduleContainer, nextScheduleContainer);
// }

const vehicleStatusHandler = async () => {
    const vehicleStatusDivs = document.querySelectorAll(".vehicle-status");
    vehicleStatusDivs.forEach((div: HTMLDivElement) => {
        if (div) {
            visualScheduleContainer.removeChild(div);
        }
    });

    const vehicleStatuses: VehicleStatus[] = await window.sqlSelect.latestVehicleStatuses({});
    const scheduleContainerWidth: number = visualScheduleContainer.getBoundingClientRect().width;

    const vehicleItemDivs = document.querySelectorAll(".vehicle-item");
    vehicleItemDivs.forEach((vehicleItem) => {
        const vehicleItemId: number = Number(vehicleItem.getAttribute("data-vehicle-id"));
        const vehicleItemRect: DOMRect = vehicleItem.getBoundingClientRect();
        const vehicleItemTop: number = vehicleItemRect.top;
        const vehicleItemWidth: number = vehicleItemRect.width;
        const vehicleItemHeight: number = vehicleItemRect.height;
        vehicleStatuses.forEach(async (vehicleStatus) => {
            if (vehicleStatus.vehicleId === vehicleItemId) {
                const vehicleStatusDiv: HTMLDivElement = document.createElement("div");
                vehicleStatusDiv.className = "vehicle-status";
                vehicleStatusDiv.setAttribute("data-vehicle-id", String(vehicleStatus.vehicleId));

                let currentLocation: string;
                switch (vehicleStatus.currentLocation) {
                    case "本店":
                        currentLocation = "本";
                        break;
                    case "空港店":
                        currentLocation = "空";
                        break;
                    case "駅前店":
                        currentLocation = "駅";
                        break;
                    default:
                        currentLocation = vehicleStatus.currentLocation;
                }

                let washState: string;
                switch (vehicleStatus.washState) {
                    case "洗車済み":
                        washState = "";
                        break;
                    case "未洗車":
                        washState = "×";
                        break;
                    default:
                        washState = vehicleStatus.washState;
                }

                vehicleStatusDiv.textContent = `${currentLocation}${washState}`;
                visualScheduleContainer.append(vehicleStatusDiv);

                const vehicleStatusDivWidth: number = vehicleStatusDiv.getBoundingClientRect().width;

                Object.assign(vehicleStatusDiv.style, {
                    display: "flex",
                    position: "fixed",
                    top: `${vehicleItemTop + (vehicleItemHeight / 2)}px`,
                    left: `${(scheduleContainerWidth / 2) + vehicleItemWidth - (vehicleStatusDivWidth / 2)}px`,
                    fontSize: "250%",
                    cursor: "default",
                    userSelect: "none"
                });

                vehicleStatusDiv.addEventListener("contextmenu", () => {
                    window.contextmenu.scheduleCell(Number(vehicleItem.getAttribute("data-vehicle-id")));
                }, false);
            }
        });
    });
}

const handleVehicleStatusPosition = () => {
    const scheduleContainerWidth = visualScheduleContainer.getBoundingClientRect().width;
    const currentVehicleStatusDivs = document.querySelectorAll(".vehicle-status");
    const currentVehicleItems = document.querySelectorAll(".vehicle-item");

    currentVehicleItems.forEach((vehicleItem) => {
        const vehicleItemId: number = Number(vehicleItem.getAttribute("data-vehicle-id"));
        currentVehicleStatusDivs.forEach((statusDiv: HTMLDivElement) => {
            const statusId: number = Number(statusDiv.getAttribute("data-vehicle-id"));
            const vehicleStatusDivWidth: number = statusDiv.getBoundingClientRect().width;
            if (vehicleItemId === statusId) {
                const vehicleItemRect: DOMRect = vehicleItem.getBoundingClientRect();
                const vehicleItemTop: number = vehicleItemRect.top;
                const vehicleItemWidth: number = vehicleItemRect.width;
                const vehicleItemHeight: number = vehicleItemRect.height;
                Object.assign(statusDiv.style, {
                    top: `${vehicleItemTop + (vehicleItemHeight / 2)}px`,
                    left: `${(scheduleContainerWidth / 2) + vehicleItemWidth - (vehicleStatusDivWidth / 2)}px`
                });
            }
        });
    });
}

// const calendarUpdater = async () => {
//     DaysContainer.calendars.forEach((calendar) => {
//         const previousEventId: number = calendar.daysContainer.calendar.updateReservationEventId;
//         window.removeEvent.wsUpdateReservationData(previousEventId);
//     });

//     const currentScrollPositionX: number = scheduleContainer.scrollLeft;

//     while (vehicleItemsContainer.firstChild) {
//         vehicleItemsContainer.removeChild(vehicleItemsContainer.firstChild);
//     }

//     const scheduleContainers = document.querySelectorAll(".schedule-container");
//     const previousMonthScheduleContainer = scheduleContainers[0];
//     const currentMonthScheduleContainer = scheduleContainers[1];
//     const nextMonthScheduleContainer = scheduleContainers[2];

//     while (previousMonthScheduleContainer.firstChild) {
//         previousMonthScheduleContainer.removeChild(previousMonthScheduleContainer.firstChild);
//     }

//     while (currentMonthScheduleContainer.firstChild) {
//         currentMonthScheduleContainer.removeChild(currentMonthScheduleContainer.firstChild);
//     }

//     while (nextMonthScheduleContainer.firstChild) {
//         nextMonthScheduleContainer.removeChild(nextMonthScheduleContainer.firstChild);
//     }

//     const vehicleAttributesArray: VehicleAttributes[] = await window.sqlSelect.vehicleAttributesByRentalClass({ rentalClass: rentalClassSelect.value });

//     const previousMonthDaysContainerInstance: DaysContainerType = DaysContainer.calendars[0].daysContainer;
//     const currentMonthDaysContainerInstance: DaysContainerType = DaysContainer.calendars[1].daysContainer;
//     const nextMonthDaysContainerInstance: DaysContainerType = DaysContainer.calendars[2].daysContainer;

//     await appendVehicleItems(vehicleAttributesArray);

//     const newPreviousMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(previousMonthDaysContainerInstance);
//     const newCurrentMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(currentMonthDaysContainerInstance);
//     const newNextMonthScheduleContainer: ScheduleContainerType = new ScheduleContainer(nextMonthDaysContainerInstance);

//     newPreviousMonthScheduleContainer.createScheduleContainer();
//     newCurrentMonthScheduleContainer.createScheduleContainer();
//     newNextMonthScheduleContainer.createScheduleContainer();

//     const previousScheduleContainer: HTMLDivElement = newPreviousMonthScheduleContainer.scheduleContainer;
//     const currentScheduleContainer: HTMLDivElement = newCurrentMonthScheduleContainer.scheduleContainer;
//     const nextScheduleContainer: HTMLDivElement = newNextMonthScheduleContainer.scheduleContainer;

//     previousMonthScheduleContainer.append(previousScheduleContainer);
//     currentMonthScheduleContainer.append(currentScheduleContainer);
//     nextMonthScheduleContainer.append(nextScheduleContainer);

//     scheduleContainer.scrollLeft = currentScrollPositionX;

//     vehicleStatusHandler();
// }

const handleDaysContainerScroll = (): void => {
    const scheduleContainerScrollLeft: number = visualScheduleContainer.scrollLeft;
    dateContainer.scrollLeft = scheduleContainerScrollLeft;

    if (scheduleContainerScrollLeft >= dateContainer.scrollLeft) {
        visualScheduleContainer.scrollLeft = dateContainer.scrollLeft;
    }
}

const handleVehicleItemsContainerScrollTop = (): void => {
    const scheduleContainerScrollTop: number = visualScheduleContainer.scrollTop;
    vehicleItemsContainer.scrollTop = scheduleContainerScrollTop;

    if (scheduleContainerScrollTop >= vehicleItemsContainer.scrollTop) {
        visualScheduleContainer.scrollTop = vehicleItemsContainer.scrollTop;
    }
}

const handleScheduleContainerScrollX = (): void => {
    const daysContainerScrollLeft: number = dateContainer.scrollLeft;
    visualScheduleContainer.scrollLeft = daysContainerScrollLeft;
}

const handleScheduleContainerScrollY = (): void => {
    const vehicleItemsContainerScrollTop: number = vehicleItemsContainer.scrollTop;
    visualScheduleContainer.scrollTop = vehicleItemsContainerScrollTop;
}

// const handleAppendPreviousMonthCalendar = async () => {
//     DaysContainer.previousMonthDiff--;
//     DaysContainer.nextMonthDiff--;
//     const newPreviousMonthDate: Date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + DaysContainer.previousMonthDiff, 0);
//     const newPreviousDaysContainerInstance: DaysContainerType = new DaysContainer(newPreviousMonthDate, false);
//     await newPreviousDaysContainerInstance.createDaysContainer();
//     const newPreviousDaysContainer: HTMLDivElement = newPreviousDaysContainerInstance.daysContainer;
//     daysContainer.firstChild.before(newPreviousDaysContainer);

//     const newPreviousScheduleContainerInstance: ScheduleContainerType = new ScheduleContainer(newPreviousDaysContainerInstance);
//     await newPreviousScheduleContainerInstance.createScheduleContainer();
//     const newPreviousMonthScheduleContainer: HTMLDivElement = newPreviousScheduleContainerInstance.scheduleContainer;
//     scheduleContainer.firstChild.before(newPreviousMonthScheduleContainer);

//     const daysContainers = document.querySelectorAll(".days-container");
//     const scheduleContainers = document.querySelectorAll(".schedule-container");
//     daysContainer.removeChild(daysContainers[3]);
//     scheduleContainer.removeChild(scheduleContainers[3]);

//     const removedElement: Calendar = DaysContainer.calendars.pop();
//     const removedScheduleBars: ScheduleBarType[] = removedElement.scheduleContainer.scheduleBars;
//     removedScheduleBars.forEach((scheduleBar: ScheduleBarType) => {
//         const scheduleBarElement: HTMLDivElement = scheduleBar.scheduleBarElement;
//         scheduleBarElement.removeEventListener("contextmenu", scheduleBar.displayContextmenu, false);
//     });

//     const updateReservationEventId: number = removedElement.daysContainer.calendar.updateReservationEventId;
//     window.removeEvent.wsUpdateReservationData(updateReservationEventId);
// }

// const handleAppendNextMonthCalendar = async () => {
//     DaysContainer.nextMonthDiff++;
//     DaysContainer.previousMonthDiff++;
//     const newNextMonthDate: Date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + DaysContainer.nextMonthDiff, 0);
//     const newNextDaysContainerInstance: DaysContainerType = new DaysContainer(newNextMonthDate, true);
//     await newNextDaysContainerInstance.createDaysContainer();
//     const newNextDaysContainer: HTMLDivElement = newNextDaysContainerInstance.daysContainer;
//     daysContainer.lastChild.after(newNextDaysContainer);

//     const newNextScheduleContainerInstance: ScheduleContainerType = new ScheduleContainer(newNextDaysContainerInstance);
//     await newNextScheduleContainerInstance.createScheduleContainer();
//     const newNextScheduleContainer: HTMLDivElement = newNextScheduleContainerInstance.scheduleContainer;
//     scheduleContainer.lastChild.after(newNextScheduleContainer);

//     const daysContainers = document.querySelectorAll(".days-container");
//     const scheduleContainers = document.querySelectorAll(".schedule-container");

//     daysContainer.removeChild(daysContainers[0]);
//     scheduleContainer.removeChild(scheduleContainers[0]);

//     const removedElement: Calendar = DaysContainer.calendars.shift();
//     const removedScheduleBars: ScheduleBarType[] = removedElement.scheduleContainer.scheduleBars;
//     removedScheduleBars.forEach((scheduleBar: ScheduleBarType) => {
//         const scheduleBarElement: HTMLDivElement = scheduleBar.scheduleBarElement;
//         scheduleBarElement.removeEventListener("contextmenu", scheduleBar.displayContextmenu, false);
//     });

//     const updateReservationEventId: number = removedElement.daysContainer.calendar.updateReservationEventId;
//     window.removeEvent.wsUpdateReservationData(updateReservationEventId);
// }

// (async (): Promise<void> => {
//     const rentalClasses: string[] | null = await window.sqlSelect.rentalClasses({ selectedSmoking: "none-specification" });

//     const allOption: HTMLOptionElement = document.createElement("option");
//     allOption.textContent = "全て";

//     if (rentalClasses) {
//         rentalClasses.forEach((rentalClass: string) => {
//             const option: HTMLOptionElement = document.createElement("option");
//             option.textContent = rentalClass;
//             rentalClassSelect.append(option);
//         });
//     }

//     rentalClassSelect.append(allOption);

// await calendarInitializer();
// })();

// rentalClassSelect.addEventListener("change", calendarUpdater, false);

visualScheduleContainer.addEventListener("scroll", handleDaysContainerScroll, false);
visualScheduleContainer.addEventListener("scroll", handleVehicleItemsContainerScrollTop, false);
dateContainer.addEventListener("scroll", handleScheduleContainerScrollX, false);
vehicleItemsContainer.addEventListener("scroll", handleScheduleContainerScrollY, false);

// previousMonthButton.addEventListener("click", handleAppendPreviousMonthCalendar, false);
// nextMonthButton.addEventListener("click", handleAppendNextMonthCalendar, false);

visualScheduleContainer.addEventListener("scroll", handleVehicleStatusPosition, false);
window.addEventListener("resize", handleVehicleStatusPosition, false);

window.webSocket.updateVehicleAttributes(async () => {
    const currentSelectedRentalClass: string = rentalClassSelect.value;
    const currentScrollPositionX: number = visualScheduleContainer.scrollLeft;
    const currentScrollPositionY: number = visualScheduleContainer.scrollTop;

    // const rentalClasses: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: null });

    while (rentalClassSelect.firstChild) {
        rentalClassSelect.removeChild(rentalClassSelect.firstChild);
    }

    // rentalClasses.forEach((rentalClass: string) => {
    //     const option = document.createElement("option");
    //     option.textContent = rentalClass;
    //     rentalClassSelect.append(option);
    // });

    const allOption = document.createElement("option");
    allOption.textContent = "全て";
    rentalClassSelect.append(allOption);

    rentalClassSelect.value = currentSelectedRentalClass;

    // await calendarUpdater();

    visualScheduleContainer.scrollLeft = currentScrollPositionX;
    visualScheduleContainer.scrollTop = currentScrollPositionY;
});

window.webSocket.updateVehicleStatus(async () => {
    vehicleStatusHandler()
});

(async () => {
    await appendRentalClassOptions();
    await appendRentalCarItems();
    await appendCalendarDateElements();
    appendVisualSchedule();
})();