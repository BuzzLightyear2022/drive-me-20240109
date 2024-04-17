import { ReservationData } from "../../@types/types";
import { VehicleItem } from "./vehicle_item.mjs";
import { DaysContainerType } from "./days_container.mjs";
import { ScheduleCell, ScheduleCellType } from "./schedule_cell.mjs";
import { ScheduleBar, ScheduleBarType } from "./schedule_bar.mjs";

export type ScheduleContainerType = InstanceType<typeof ScheduleContainer>;

export const ScheduleContainer = class {
    scheduleContainer: HTMLDivElement;
    daysContainer: DaysContainerType;
    scheduleCells: ScheduleCellType[] = [];

    constructor(daysContainer: DaysContainerType) {
        this.daysContainer = daysContainer;
        // @ts-ignore
        daysContainer.calendar.scheduleContainer = this;
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
            console.log(true);
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