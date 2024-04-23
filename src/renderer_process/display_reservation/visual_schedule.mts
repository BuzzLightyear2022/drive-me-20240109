import { Reservation } from "../../@types/types";
import { RentalCarItem } from "./rentalCar_item.mjs";
import { ScheduleCell } from "./schedule_cell.mjs";
import { ScheduleBar } from "./schedule_bar.mjs";

export class VisualSchedule extends HTMLElement {
    constructor(args: { calendarDateElement: Element }) {
        const { calendarDateElement } = args;

        super();

        const calendarDateWidth: number = calendarDateElement.getBoundingClientRect().width;

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "column",
            minWidth: `${calendarDateWidth}px`,
            whiteSpace: "nowrap"
        });

        this.appendScheduleCells();
        this.appendScheduleBars({ calendarDateElement: calendarDateElement });
    }

    appendScheduleCells = (): void => {
        const rentalCarItems: NodeListOf<Element> = document.querySelectorAll("rental-car-item");

        rentalCarItems.forEach((rentalCarItem: Element) => {
            const scheduleCell: ScheduleCell = new ScheduleCell({ rentalCarItem: rentalCarItem });
            this.append(scheduleCell);
        });
    }

    appendScheduleBars = async (args: { calendarDateElement: Element }) => {
        const { calendarDateElement } = args;

        const calendarStartTimestamp: number = Number(calendarDateElement.getAttribute("calendar-start-timestamp"));
        const calendarEndTimestamp: number = Number(calendarDateElement.getAttribute("calendar-end-timestamp"));
        const calendarStartDate: Date = new Date(calendarStartTimestamp);
        const calendarEndDate: Date = new Date(calendarEndTimestamp);

        const monthReservations: Reservation[] = await window.sqlSelect.reservations({ startDate: calendarStartDate, endDate: calendarEndDate });
        const scheduleCells: HTMLCollection = this.children;

        monthReservations.forEach((reservation: Reservation) => {
            const selectedVehicleId: number = Number(reservation.selectedVehicleId);

            for (let scheduleCell of scheduleCells) {
                const scheduleCellVehicleId: number = Number(scheduleCell.getAttribute("data-vehicle-id"));

                if (selectedVehicleId === scheduleCellVehicleId) {
                    // rewritable
                    const rentalScheduleCell: ChildNode = scheduleCell.childNodes[0];
                    const scheduleBar: ScheduleBar = new ScheduleBar({ calendarDateElement: calendarDateElement, reservation: reservation });

                    rentalScheduleCell.appendChild(scheduleBar);
                }

            }
        });
    }

    createScheduleContainer = async () => {
        const daysContainer: HTMLDivElement = this.daysContainer.daysContainer;
        const daysContainerWidth: number = daysContainer.getBoundingClientRect().width;

        this.scheduleContainer = document.createElement("div");
        Object.assign(this.scheduleContainer.style, {
            display: "flex",
            flexDirection: "column",
            minWidth: `${daysContainerWidth}px`,
            whiteSpace: "nowrap"
        });
        this.scheduleContainer.className = "schedule-container";

        VehicleItem.instances.forEach(async (instance) => {
            const vehicleItem: HTMLDivElement = instance.vehicleItem;

            const scheduleCellInstance: ScheduleCellType = new ScheduleCell(instance);
            scheduleCellInstance.daysContainer = this.daysContainer;
            await scheduleCellInstance.createScheduleCell();

            const scheduleCell: HTMLDivElement = scheduleCellInstance.scheduleCell;

            this.scheduleCells.push(scheduleCellInstance);
            this.scheduleContainer.append(scheduleCell);

            window.addEventListener("resize", () => {
                const daysContainerWidth: number = daysContainer.getBoundingClientRect().width;
                const vehicleItemHeight: number = vehicleItem.getBoundingClientRect().height;

                scheduleCellInstance.handleWindowResize({
                    width: `${daysContainerWidth}px`,
                    height: `${vehicleItemHeight}px`
                });
            }, false);
        });

        this.appendSchedulebars();
        this.updateScheduleBars();
    }

    appendSchedulebars = async (): Promise<void> => {
        const calendarDateObject: Date = this.daysContainer.dateObject;
        const calendarYear: number = calendarDateObject.getFullYear();
        const calendarMonthIndex: number = calendarDateObject.getMonth();

        const startDate: Date = new Date(calendarYear, calendarMonthIndex, 1, 0, 0, 0, 0);
        const endDate: Date = new Date(calendarYear, calendarMonthIndex + 1, 0, 23, 59, 59, 999);

        const monthReservationData: ReservationData[] | null = await window.sqlSelect.reservationData({
            startDate: startDate,
            endDate: endDate
        });

        const processScheduleBar = (args: {
            scheduleCellInstance: ScheduleCellType,
            reservationData: ReservationData
        }) => {
            const {
                scheduleCellInstance,
                reservationData
            } = args;

            const reservationScheduleDiv: HTMLDivElement = scheduleCellInstance.scheduleDivs.reservationScheduleDiv;
            const maintenanceScheduleDiv: HTMLDivElement = scheduleCellInstance.scheduleDivs.maintenanceScheduleDiv;

            const previousScheduleBar: Element | undefined = reservationScheduleDiv.lastElementChild;
            const previousScheduleBarWidth: number = previousScheduleBar ? previousScheduleBar.getBoundingClientRect().width : 0;

            const scheduleBarInstance: ScheduleBarType = new ScheduleBar({
                reservationData: reservationData,
                startMsOfCalendar: startDate.getTime(),
                endMsOfCalendar: endDate.getTime(),
                previousScheduleBarWidth: previousScheduleBarWidth,
                scheduleBarColor: "green"
            });

            scheduleBarInstance.createScheduleBar();
            const scheduleBar: HTMLDivElement = scheduleBarInstance.scheduleBarElement;

            reservationScheduleDiv.append(scheduleBar);
        }

        if (monthReservationData) {
            monthReservationData.forEach((reservationData: ReservationData) => {
                this.scheduleCells.forEach(scheduleCellInstance => {

                    const vehicleId: string = scheduleCellInstance.vehicleItem.vehicleAttributes.id;
                    const pickupDate: Date = new Date(reservationData.pickupDatetime);

                    if ((reservationData.selectedVehicleId == vehicleId) && (pickupDate.getTime() >= startDate.getTime())) {
                        processScheduleBar({
                            scheduleCellInstance: scheduleCellInstance,
                            reservationData: reservationData
                        });
                    } else if ((reservationData.selectedVehicleId == vehicleId) && (pickupDate.getTime() <= startDate.getTime())) {
                        processScheduleBar({
                            scheduleCellInstance: scheduleCellInstance,
                            reservationData: reservationData
                        });
                    }
                });
            });
        }
    }

    updateScheduleBars = () => {
        const eventId: number = window.webSocket.updateReservationData(() => {
            this.scheduleBars.forEach(instance => {
                const scheduleBarElm: HTMLDivElement = instance.scheduleBarElement;
                scheduleBarElm.removeEventListener("contextmenu", instance.displayContextmenu, false);
            });

            this.scheduleBars.length = 0;

            this.scheduleCells.forEach(instance => {
                const scheduleDivs = instance.scheduleDivs;
                const reservationScheduleDiv: HTMLDivElement = scheduleDivs.reservationScheduleDiv;
                const maintenanceScheduleDiv: HTMLDivElement = scheduleDivs.maintenanceScheduleDiv;

                while (reservationScheduleDiv.firstChild) {
                    reservationScheduleDiv.removeChild(reservationScheduleDiv.firstChild);
                }

                while (maintenanceScheduleDiv.firstChild) {
                    maintenanceScheduleDiv.removeChild(maintenanceScheduleDiv.firstChild);
                }
            });

            this.appendSchedulebars();
        });

        this.daysContainer.calendar.updateReservationEventId = eventId;
    }
}

customElements.define("visual-schedule", VisualSchedule);