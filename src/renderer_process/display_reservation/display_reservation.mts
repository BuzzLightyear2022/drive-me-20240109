import { RentalCar, RentalCarStatus } from "../../@types/types";
import { RentalCarItem } from "./rentalCar_item.mjs";
import { CalendarDate } from "./calendar_date.mjs";
import { VisualSchedule } from "./visual_schedule.mjs";
import { RentalCarStatusElement } from "./rentalCar_status_element.mjs"

const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class-select");

const appendRentalClassOptions = async (): Promise<void> => {
    const existingRentalClasses: string[] | null = await window.sqlSelect.existingRentalClasses({});
    if (existingRentalClasses) {
        await Promise.all(existingRentalClasses.map((rentalClass: string) => {
            const rentalClassOption: HTMLOptionElement = document.createElement("option");
            rentalClassOption.textContent = rentalClass;
            rentalClassSelect.append(rentalClassOption);
        }));
    }

    const allOption: HTMLOptionElement = document.createElement("option");
    allOption.textContent = "全て";
    allOption.value = "";
    rentalClassSelect.append(allOption);
}

const appendRentalCarItems = async (args: { rentalCars: RentalCar[] }): Promise<void> => {
    const { rentalCars } = args;

    const rentalCarItemsContainer: HTMLDivElement = document.querySelector("#rental-car-items-container");

    if (rentalCars) {
        await Promise.all(rentalCars.map((rentalCar: RentalCar) => {
            const rentalCarItem: HTMLElement = new RentalCarItem({ rentalCar: rentalCar });
            rentalCarItemsContainer.append(rentalCarItem);
        }));
    }
}

const rentalCarStatusHandler = async (args: { rentalCars: RentalCar[] }) => {
    const { rentalCars } = args;

    const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");
    const visualScheduleContainerWidth: number = visualScheduleContainer.getBoundingClientRect().width;

    const rentalCarItems: NodeListOf<Element> = document.querySelectorAll("rental-car-item");

    for (const rentalCarItem of rentalCarItems) {
        const rentalCarItemId: string = rentalCarItem.getAttribute("data-rentalCar-id");

        await Promise.all(rentalCars.map((rentalCar: RentalCar) => {
            if (rentalCarItemId === String(rentalCar.id)) {
                if (rentalCar.RentalCarStatuses.length) {
                    const rentalCarItemWidth: number = rentalCarItem.getBoundingClientRect().width;
                    const centerPositionX = `${(visualScheduleContainerWidth / 2) + rentalCarItemWidth}px`;

                    const rentalCarStatusStyle = {
                        display: "flex",
                        position: "fixed",
                        left: centerPositionX,
                        fontSize: "250%",
                        cursor: "default",
                        userSelect: "none"
                    }

                    const rentalCarStatusElement: RentalCarStatusElement = new RentalCarStatusElement({ rentalCarStatus: rentalCar.RentalCarStatuses[0], style: rentalCarStatusStyle });

                    rentalCarItem.append(rentalCarStatusElement);
                }
            }
        }));
    }

    const scrollHandler = {
        handleEvent: (event: Event) => {
            rentalCarItems.forEach((rentalCarItem: Element) => {
                const statusElement: RentalCarStatusElement = rentalCarItem.querySelector("rental-car-status");

                if (statusElement) {
                    const rentalCarItemHeight: number = rentalCarItem.getBoundingClientRect().height;

                    const rentalCarItemScrollTop: number = rentalCarItem.getBoundingClientRect().top;
                    statusElement.style.top = `${rentalCarItemScrollTop + (rentalCarItemHeight / 2)}px`;
                }
            });
        }
    }

    const resizeHandler = {
        handleEvent: (event: Event) => {
            rentalCarItems.forEach((rentalCarItem: Element) => {
                const statusElement: RentalCarStatusElement = rentalCarItem.querySelector("rental-car-status");

                if (statusElement) {
                    const visualScheduleContainerWidth: number = visualScheduleContainer.getBoundingClientRect().width;
                    const rentalCarItemWidth: number = rentalCarItem.getBoundingClientRect().width;
                    const centerPositionX = `${rentalCarItemWidth + (visualScheduleContainerWidth / 2)}px`;

                    statusElement.style.left = centerPositionX;
                }
            });
        }
    }

    visualScheduleContainer.addEventListener("scroll", scrollHandler, false);
    window.addEventListener("resize", resizeHandler, false);
}

const appendCalendarDateElements = async (): Promise<void> => {
    const dateContainer: HTMLDivElement = document.querySelector("#date-container");

    const currentDate: Date = new Date();
    const currentYear: number = currentDate.getFullYear();
    const currentMonthIndex: number = currentDate.getMonth();

    const previousMonthDate: Date = new Date(currentYear, currentMonthIndex, 0);
    const nextMonthDate: Date = new Date(currentYear, currentMonthIndex + 2, 0);

    const previousMonthCalendarDate: CalendarDate = new CalendarDate({ dateObject: previousMonthDate });
    const currentMonthCalendarDate: CalendarDate = new CalendarDate({ dateObject: currentDate });
    const nextMonthCalendarDate: CalendarDate = new CalendarDate({ dateObject: nextMonthDate });

    dateContainer.append(previousMonthCalendarDate, currentMonthCalendarDate, nextMonthCalendarDate);
}

const appendVisualSchedule = async (): Promise<void> => {
    const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");
    const calendarDateElements: NodeListOf<Element> = document.querySelectorAll("calendar-date");

    const previousMonthDateElement: Element = calendarDateElements[0];
    const currentMonthDateElement: Element = calendarDateElements[1];
    const nextMonthDateElement: Element = calendarDateElements[2];

    const previousMonthVisualSchedule: HTMLElement = new VisualSchedule({ calendarDateElement: previousMonthDateElement });
    const currentMonthVisualSchedule: HTMLElement = new VisualSchedule({ calendarDateElement: currentMonthDateElement });
    const nextMonthVisualSchedule: HTMLElement = new VisualSchedule({ calendarDateElement: nextMonthDateElement });

    visualScheduleContainer.append(previousMonthVisualSchedule, currentMonthVisualSchedule, nextMonthVisualSchedule);
}

const handleInitialScrollPosition = () => {
    const dateContainer: HTMLDivElement = document.querySelector("#date-container");

    let totalCalendarWidth: number = 0;
    let totalCalendarDays: number = 0;

    const calendarDateElements: HTMLCollection = dateContainer.children;
    for (let calendarDateElement of calendarDateElements) {
        const calendarDateElementWidth: number = calendarDateElement.getBoundingClientRect().width;
        totalCalendarWidth += calendarDateElementWidth;

        const dayCells: HTMLCollection = calendarDateElement.children;
        const calendarDays: number = dayCells.length;
        totalCalendarDays += calendarDays;
    }

    const todayDate: number = new Date().getDate();
    const firstCalendarDate: ChildNode = dateContainer.firstChild;
    const datesOfFirstCalendar: number = firstCalendarDate.childNodes.length;

    const eachDayWidth: number = totalCalendarWidth / totalCalendarDays;
    const todayPosition: number = ((datesOfFirstCalendar + todayDate) * eachDayWidth) - (eachDayWidth / 2);

    const calendarDateViewWidth: number = dateContainer.getBoundingClientRect().width;
    const centerPosition: number = todayPosition - (calendarDateViewWidth / 2);

    dateContainer.scrollLeft = centerPosition;
}

const handleDisplayMonth = () => {
    const monthDisplay: HTMLDivElement = document.querySelector("#month-display");
    const dateContainer: HTMLDivElement = document.querySelector("#date-container");
    const calendarDateElements = dateContainer.children;

    const defineIntersectionObserver = (): IntersectionObserver => {
        const dateContainerWidth: number = dateContainer.getBoundingClientRect().width;

        const intersectionObserver: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {
                    const calendarDateElement: Element = entry.target;
                    const targetCalendarStartTimestamp: number = Number(calendarDateElement.getAttribute("calendar-start-timestamp"));
                    const targetCalendarStartDate: Date = new Date(targetCalendarStartTimestamp);
                    monthDisplay.textContent = `${targetCalendarStartDate.getFullYear()}年${targetCalendarStartDate.getMonth() + 1}月`;
                }
            });
        }, {
            root: dateContainer,
            rootMargin: `0px -${dateContainerWidth}px 0px 0px`
        });

        for (let calendarDateElement of calendarDateElements) {
            intersectionObserver.observe(calendarDateElement);
        }

        return intersectionObserver;
    }

    defineIntersectionObserver();

    window.addEventListener("resize", defineIntersectionObserver, false);
}

const loadScheduleHandler = () => {
    const previousMonthButton: HTMLButtonElement = document.querySelector("#previous-month-button");
    const nextMonthButton: HTMLButtonElement = document.querySelector("#next-month-button");

    const loadNextMonth = async () => {
        const dateContainer: HTMLDivElement = document.querySelector("#date-container");
        const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");

        const lastCalendarDateElement: Element = dateContainer.lastChild as Element;
        const lastCalendarStartTimestamp: number = Number(lastCalendarDateElement.getAttribute("calendar-start-timestamp"));
        const lastCalendarStartDate: Date = new Date(lastCalendarStartTimestamp);
        const newCalendarStartDate: Date = new Date(lastCalendarStartDate.getFullYear(), lastCalendarStartDate.getMonth() + 1, 1);

        const newCalendarDate: CalendarDate = new CalendarDate({ dateObject: newCalendarStartDate });
        dateContainer.append(newCalendarDate);

        await new Promise((resolve) => { setTimeout(resolve, 200) });

        const newVisualSchedule: VisualSchedule = new VisualSchedule({ calendarDateElement: newCalendarDate });
        visualScheduleContainer.append(newVisualSchedule);

        dateContainer.removeChild(dateContainer.firstChild);
        visualScheduleContainer.removeChild(visualScheduleContainer.firstChild);

        handleDisplayMonth();
    }

    const loadPreviousMonth = async () => {
        const dateContainer: HTMLDivElement = document.querySelector("#date-container");
        const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");

        const firstCalendarDateElement: Element = dateContainer.firstChild as Element;
        const firstCalendarStartTimestamp: number = Number(firstCalendarDateElement.getAttribute("calendar-start-timestamp"));
        const firstCalendarStartDate: Date = new Date(firstCalendarStartTimestamp);
        const newCalendarStartDate: Date = new Date(firstCalendarStartDate.getFullYear(), firstCalendarStartDate.getMonth() - 1, 1);

        const newCalendarDate: CalendarDate = new CalendarDate({ dateObject: newCalendarStartDate });
        dateContainer.prepend(newCalendarDate);

        await new Promise((resolve) => { setTimeout(resolve, 200) });

        const newVisualSchedule: VisualSchedule = new VisualSchedule({ calendarDateElement: newCalendarDate });
        visualScheduleContainer.prepend(newVisualSchedule);

        dateContainer.removeChild(dateContainer.lastChild);
        visualScheduleContainer.removeChild(visualScheduleContainer.lastChild);

        handleDisplayMonth();
    }

    nextMonthButton.addEventListener("click", loadNextMonth, false);
    previousMonthButton.addEventListener("click", loadPreviousMonth, false);
}

const handleSynchronousScroll = () => {
    const dateContainer: HTMLDivElement = document.querySelector("#date-container");
    const rentalCarItemsContainer: HTMLDivElement = document.querySelector("#rental-car-items-container");
    const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");

    const handleDaysContainerScroll = (): void => {
        const dateContainer: HTMLDivElement = document.querySelector("#date-container");

        const scheduleContainerScrollLeft: number = visualScheduleContainer.scrollLeft;
        dateContainer.scrollLeft = scheduleContainerScrollLeft;

        if (scheduleContainerScrollLeft >= dateContainer.scrollLeft) {
            visualScheduleContainer.scrollLeft = dateContainer.scrollLeft;
        }
    }

    const handleVehicleItemsContainerScroll = (): void => {
        const scheduleContainerScrollTop: number = visualScheduleContainer.scrollTop;
        rentalCarItemsContainer.scrollTop = scheduleContainerScrollTop;

        if (scheduleContainerScrollTop >= rentalCarItemsContainer.scrollTop) {
            visualScheduleContainer.scrollTop = rentalCarItemsContainer.scrollTop;
        }
    }

    const handleScheduleContainerScrollX = (): void => {
        const dateContainer: HTMLDivElement = document.querySelector("#date-container");

        const daysContainerScrollLeft: number = dateContainer.scrollLeft;
        visualScheduleContainer.scrollLeft = daysContainerScrollLeft;
    }

    const handleScheduleContainerScrollY = (): void => {
        const vehicleItemsContainerScrollTop: number = rentalCarItemsContainer.scrollTop;
        visualScheduleContainer.scrollTop = vehicleItemsContainerScrollTop;
    }

    visualScheduleContainer.addEventListener("scroll", handleDaysContainerScroll, false);
    visualScheduleContainer.addEventListener("scroll", handleVehicleItemsContainerScroll, false);
    dateContainer.addEventListener("scroll", handleScheduleContainerScrollX, false);
    rentalCarItemsContainer.addEventListener("scroll", handleScheduleContainerScrollY, false);
}

const calendarUpdater = async () => {
    const selectedRentalClass: string = rentalClassSelect.value;
    const rentalCars: RentalCar[] = await window.sqlSelect.rentalCars({ rentalClass: selectedRentalClass });

    const rentalCarItemsContainer: HTMLDivElement = document.querySelector("#rental-car-items-container");
    const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");

    const visualScheduleContainerScrollTop: number = visualScheduleContainer.scrollTop;
    const visualScheduleContainerScrollLeft: number = visualScheduleContainer.scrollLeft;

    while (rentalCarItemsContainer.firstChild) {
        rentalCarItemsContainer.removeChild(rentalCarItemsContainer.firstChild);
    }

    while (visualScheduleContainer.firstChild) {
        visualScheduleContainer.removeChild(visualScheduleContainer.firstChild);
    }

    await appendRentalCarItems({ rentalCars: rentalCars });

    await new Promise((resolve) => { setTimeout(resolve, 100) });

    await appendVisualSchedule();

    visualScheduleContainer.scrollTop = visualScheduleContainerScrollTop;
    visualScheduleContainer.scrollLeft = visualScheduleContainerScrollLeft;

    await rentalCarStatusHandler({ rentalCars: rentalCars });
}

const calendarInitializer = async () => {
    await appendRentalClassOptions();

    const selectedRentalClass: string = rentalClassSelect.value;
    const rentalCars: RentalCar[] = await window.sqlSelect.rentalCars({ rentalClass: selectedRentalClass });

    await appendCalendarDateElements();
    await appendRentalCarItems({ rentalCars: rentalCars });

    await new Promise((resolve) => { setTimeout(resolve, 1000) });

    await appendVisualSchedule();

    handleInitialScrollPosition();
    handleDisplayMonth();
    handleSynchronousScroll();
    loadScheduleHandler();

    await rentalCarStatusHandler({ rentalCars: rentalCars });
}

(async () => {
    await calendarInitializer();
    rentalClassSelect.addEventListener("change", calendarUpdater, false);

    window.webSocket.updateReservationData(calendarUpdater);
    window.webSocket.updateRentalCarStatus(calendarUpdater);
})();