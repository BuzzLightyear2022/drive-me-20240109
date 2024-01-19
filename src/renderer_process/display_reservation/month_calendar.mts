import { VehicleAttributes, ReservationData } from "../../@types/types";
import { getMonthName } from "../common_modules.mjs";
import { VehicleScheduleCell } from "./vehicle_schedule_cell.mjs";
import { ScheduleBar } from "./schedule_bar.mjs";

export type MonthCalendarType = InstanceType<typeof MonthCalendar>;
export type VehicleScheduleCellType = InstanceType<typeof VehicleScheduleCell>;

export const MonthCalendar = class {
    calendarInfo: {
        dateObject: Date,
        monthCalendar: HTMLDivElement,
        vehicleScheduleCells: VehicleScheduleCellType[],
        intersectionObserver: IntersectionObserver[],
        vehicleAttributesArray: VehicleAttributes[],
        reservationDataArray: ReservationData[],
        addNext: boolean
    }

    constructor(args: {
        vehicleAttributesArray: VehicleAttributes[],
        dateObject: Date,
        addNext: boolean
    }) {
        const {
            dateObject,
            vehicleAttributesArray,
            addNext
        } = args;

        this.calendarInfo.dateObject = dateObject;
        this.calendarInfo.vehicleAttributesArray = vehicleAttributesArray;
        this.calendarInfo.addNext = addNext;
    }

    daysContainer(): HTMLDivElement {
        const currentDate: Date = new Date();

        const calendarYear: number = this.calendarInfo.dateObject.getFullYear();
        const calendarMonthIndex: number = this.calendarInfo.dateObject.getMonth();
        const calendarDays: number = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();

        const DaysContainer = (): HTMLDivElement => {
            const daysContainer: HTMLDivElement = document.createElement("div");
            Object.assign(daysContainer.style, {
                display: "flex",
                flexDirection: "row",
                flexBasis: "auto",
                flexGrow: 1,
                flexShrink: 1,
                whiteSpace: "nowrap",
                overflow: "visible",
            });

            return daysContainer;
        }

        const daysContainer: HTMLDivElement = DaysContainer();

        for (let i = 1; i <= calendarDays; i++) {
            const dayCell: HTMLDivElement = document.createElement("div");
            Object.assign(dayCell.style, {
                display: "flex",
                justifyContent: "center",
                height: "50px",
                minWidth: "120px",
                lineHeight: "200%",
                fontSize: "x-large",
                border: "solid",
                borderWidth: "1px 0.5px"
            });

            dayCell.textContent = i === 1 ? `${getMonthName(calendarMonthIndex)}${i}日` : `${i}日`;

            if (calendarYear === currentDate.getFullYear() && calendarMonthIndex === currentDate.getMonth() && i === currentDate.getDate()) {
                dayCell.style.backgroundColor = "red"
            }

            daysContainer.append(dayCell);
        }
        return daysContainer;
    }

    backgroundDiv = (): HTMLDivElement => {
        const backgroundDiv: HTMLDivElement = document.createElement("div");
        Object.assign(backgroundDiv.style, {
            display: "block",
            width: "100%",
            height: "100%",
            left: "0",
            top: "0",
            position: "fixed",
            zIndex: "1"
        })
        return backgroundDiv;
    }

    appendScheduleCells = (args: {
        vehicleAttributesArray: VehicleAttributes[],
        daysContainerWidth: number,
        addNext: boolean
    }): void => {
        const {
            vehicleAttributesArray,
            daysContainerWidth,
            addNext
        } = args;

        const calendarContainer: HTMLDivElement = document.querySelector("#calendar-container-div");

        const ScheduleContainer = (): HTMLDivElement => {
            const calendarScheduleContainer: HTMLDivElement = document.createElement("div");
            Object.assign(calendarScheduleContainer.style, {
                display: "flex",
                flexDirection: "column",
                flexBasis: "content",
                whiteSpace: "nowrap"
            });
            return calendarScheduleContainer;
        }

        const scheduleContainer: HTMLDivElement = ScheduleContainer();

        vehicleAttributesArray.forEach((vehicleAttributes: VehicleAttributes) => {
            const vehicleScheduleCell = new VehicleScheduleCell({
                vehicleAttributes: vehicleAttributes,
                vehicleCalendarWidth: daysContainerWidth
            });

            scheduleContainer.append(vehicleScheduleCell.vehicleScheduleCellInfo.vehicleScheduleCell);
            this.calendarInfo.vehicleScheduleCells.push(vehicleScheduleCell);
        });

        this.calendarInfo.monthCalendar = scheduleContainer;

        addNext ? calendarContainer.append(scheduleContainer) : calendarContainer.children[0].before(scheduleContainer);
    }

    appendScheduleBars = async (): Promise<void> => {
        const calendarYear: number = this.calendarInfo.dateObject.getFullYear();
        const calendarMonthIndex: number = this.calendarInfo.dateObject.getMonth();

        const startDate: Date = new Date(calendarYear, calendarMonthIndex, 1, 0, 0, 0, 0);
        const endDate: Date = new Date(calendarYear, calendarMonthIndex + 1, 0, 23, 59, 59, 999);
        const totalMsOfMonth: number = endDate.getTime() - startDate.getTime();

        const monthReservationData: ReservationData[] = await window.sqlSelect.reservationData({
            startDate: startDate,
            endDate: endDate
        });

        this.calendarInfo.reservationDataArray = monthReservationData;

        this.calendarInfo.reservationDataArray.forEach((reservationData: ReservationData) => {
            this.calendarInfo.vehicleScheduleCells.forEach((vehicleScheduleCell) => {
                const reservationScheduleDiv: HTMLDivElement = vehicleScheduleCell.vehicleScheduleCellInfo.reservationScheduleDiv;

                if (reservationData.vehicleId === vehicleScheduleCell.vehicleScheduleCellInfo.vehicleId) {
                    const previousScheduleBar: Element | undefined = reservationScheduleDiv.lastElementChild;
                    const previousScheduleBarWidth: number = previousScheduleBar ? previousScheduleBar.getBoundingClientRect().width : 0;

                    const scheduleBar = new ScheduleBar({
                        reservationData: reservationData,
                        calendarStartMs: startDate.getTime(),
                        totalMsOfSchedule: totalMsOfMonth,
                        previousScheduleBarWidth: `${previousScheduleBarWidth}px`,
                        color: "green"
                    }).getScheduleBarElement();

                    reservationDisplayDiv.append(newScheduleBar);
                }
            });
        });
    }

    appendCalendar = async () => {
        const calendarContainer: HTMLDivElement = document.querySelector("#calendar-container-div");

        const daysContainer: HTMLDivElement = this.daysContainer();
        this.addNext ? calendarContainer.append(daysContainer) : calendarContainer.children[0].before(daysContainer);

        const daysContainerWidth: number = daysContainer.getBoundingClientRect().width;

        await this.appendVehicleAttributesCells({
            vehicleAttributesArray: this.calendarInfo.vehicleAttributesArray,
            daysContainerWidth: daysContainerWidth,
            addNext: this.addNext
        });

        await this.appendScheduleBars();
    }

    updateScheduleBars = async () => {
        this.vehicleScheduleCells.forEach((vehicleScheduleCell) => {
            const reservationScheduleDiv = vehicleScheduleCell.reservationScheduleDiv;

            while (reservationScheduleDiv.firstChild) {
                reservationScheduleDiv.removeChild(reservationScheduleDiv.firstChild);
            }
        });
        await this.appendScheduleBars();
    }

    getCalendarInfo() {
        return this.calendarInfo;
    }

    updateVehicleAttributesCells = () => {
        const vehicleScheduleContainer: HTMLDivElement = document.querySelector("#vehicle-schedule-container-div");
        while (vehicleScheduleContainer.firstChild) {
            vehicleScheduleContainer.removeChild(vehicleScheduleContainer.firstChild);
        }
    }
}