import { ReservationData } from "../../@types/types";
import { VehicleItem, VehicleItemType } from "./vehicle_item.mjs";
import { DaysContainerType } from "./days_container.mjs";
import { ScheduleCell, ScheduleCellType } from "./schedule_cell.mjs";
import { ScheduleBar, ScheduleBarType } from "./schedule_bar.mjs";

export type ScheduleContainerType = InstanceType<typeof ScheduleContainer>;

export const ScheduleContainer = class {
    scheduleContainer: HTMLDivElement;
    daysContainer: DaysContainerType;
    scheduleCells: ScheduleCellType[] = [];
    width: number;
    height: number;

    constructor(daysContainer: DaysContainerType) {
        this.daysContainer = daysContainer;
        // @ts-ignore
        daysContainer.calendar.scheduleContainer = this;
    }

    createScheduleContainer = () => {
        this.scheduleContainer = document.createElement("div");
        Object.assign(this.scheduleContainer.style, {
            display: "flex",
            flexDirection: "column",
            flexBasis: "content",
            whiteSpace: "nowrap"
        });

        VehicleItem.instances.forEach(instance => {
            const daysContainer: HTMLDivElement = this.daysContainer.daysContainer;
            const daysContainerWidth: number = daysContainer.getBoundingClientRect().width;
            this.width = daysContainerWidth;

            const vehicleItem: HTMLDivElement = instance.vehicleItem;
            const vehicleItemHeight: number = vehicleItem.getBoundingClientRect().height;
            this.height = vehicleItemHeight;

            const scheduleCellInstance: ScheduleCellType = new ScheduleCell({
                width: `${this.width}px`,
                height: `${this.height}px`,
                vehicleItem: instance
            });
            scheduleCellInstance.createScheduleCell();

            const scheduleCell: HTMLDivElement = scheduleCellInstance.scheduleCell;

            this.scheduleCells.push(scheduleCellInstance);
            this.scheduleContainer.append(scheduleCell);
        });
    }

    appendSchedulebars = async (): Promise<void> => {
        const calendarDateObject: Date = this.daysContainer.dateObject;
        const calendarYear: number = calendarDateObject.getFullYear();
        const calendarMonthIndex: number = calendarDateObject.getMonth();

        const startDate: Date = new Date(calendarYear, calendarMonthIndex, 1, 0, 0, 0, 0);
        const endDate: Date = new Date(calendarYear, calendarMonthIndex + 1, 0, 23, 59, 59, 999);
        const totalMsOfMonth: number = endDate.getTime() - startDate.getTime();

        const monthReservationData: ReservationData[] = await window.sqlSelect.reservationData({
            startDate: startDate,
            endDate: endDate
        });

        monthReservationData.forEach(reservation => {
            this.scheduleCells.forEach(instance => {
                const reservationScheduleDiv: HTMLDivElement = instance.scheduleDivs.reservationScheduleDiv;
                const maintenanceScheduleDiv: HTMLDivElement = instance.scheduleDivs.maintenanceScheduleDiv;

                const vehicleId = instance.vehicleItem.vehicleAttributes.id;

                if (reservation.vehicleId === vehicleId) {
                    const previousScheduleBar: Element | undefined = reservationScheduleDiv.lastElementChild;
                    const previousScheduleBarWidth: number = previousScheduleBar ? previousScheduleBar.getBoundingClientRect().width : 0;

                    const scheduleBarInstance: ScheduleBarType = new ScheduleBar({
                        reservationData: reservation,
                        startMsOfCalendar: startDate.getTime(),
                        totalMsOfCalendar: totalMsOfMonth,
                        previousScheduleBarWidth: previousScheduleBarWidth,
                        scheduleBarColor: "green"
                    });

                    scheduleBarInstance.createScheduleBar();
                    const scheduleBar: HTMLDivElement = scheduleBarInstance.scheduleBarElement;

                    reservationScheduleDiv.append(scheduleBar);
                }
            });
        });
    }
}