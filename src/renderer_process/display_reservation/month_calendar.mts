import { VehicleAttributes, CalendarInfo, ReservationData, VehicleScheduleCellInfo } from "../../@types/types";
import { getMonthName } from "../common_modules.mjs";
import { VehicleScheduleCell } from "./vehicle_schedule_cell.mjs";
import { ScheduleBar } from "./schedule_bar.mjs";

const MonthCalendar = class {
    calendarInfo: CalendarInfo;
    date: Date;
    reservationDataArray: ReservationData[];
    vehicleScheduleCells: VehicleScheduleCellInfo[] = [];

    constructor(args: {
        vehicleAttributesArray: VehicleAttributes[],
        date: Date
    }) {
        const { date, vehicleAttributesArray } = args;

        this.date = date;
        this.calendarInfo = {
            year: date.getFullYear(),
            monthIndex: date.getMonth()
        }

        const calendarContainer: HTMLDivElement = document.querySelector("#calendar-container-div") as HTMLDivElement;
        const vehicleScheduleContainer: HTMLDivElement = document.querySelector("#vehicle-schedule-container-div") as HTMLDivElement;

        const innerVehicleScheduleContainer: HTMLDivElement = this.innerVehicleScheduleContainer();

        const daysContainer: HTMLDivElement = this.daysContainer({ date: date });
        calendarContainer.append(daysContainer);

        const daysContainerWidth: number = daysContainer.getBoundingClientRect().width;

        vehicleAttributesArray.forEach((vehicleAttributes: VehicleAttributes) => {
            const vehicleScheduleCell = new VehicleScheduleCell({
                vehicleAttributes: vehicleAttributes,
                vehicleCalendarWidth: `${daysContainerWidth}px`
            });
            innerVehicleScheduleContainer.append(vehicleScheduleCell.vehicleScheduleCell);
            this.vehicleScheduleCells.push(vehicleScheduleCell);
        });

        vehicleScheduleContainer.append(innerVehicleScheduleContainer);
    }

    private daysContainer(args: { date: Date }): HTMLDivElement {
        const { date } = args;

        const daysContainer: HTMLDivElement = document.createElement("div");
        daysContainer.id = "days_container";
        Object.assign(daysContainer.style, {
            display: "flex",
            flexDirection: "row",
            flexBasis: "auto",
            flexGrow: 1,
            flexShrink: 1,
            whiteSpace: "nowrap"
        });

        const daysOfMonth: number = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        for (let i = 1; i <= daysOfMonth; i++) {
            const dayCell: HTMLDivElement = document.createElement("div");
            Object.assign(dayCell.style, {
                display: "flex",
                justifyContent: "center",
                height: "50px",
                minWidth: "120px",
                lineHeight: "200%",
                fontSize: "x-large",
                border: "solid"
            });

            const monthIndex: number = new Date(date).getMonth();
            dayCell.textContent = i === 1 ? `${getMonthName({ monthIndex })}${i}日` : `${i}日`;

            if (i === date.getDate() && this.calendarInfo.monthIndex === new Date().getMonth()) {
                dayCell.style.backgroundColor = "red"
            }

            daysContainer.append(dayCell);
        }
        return daysContainer;
    }

    private innerVehicleScheduleContainer = (): HTMLDivElement => {
        const vehicleScheduleContainer: HTMLDivElement = document.createElement("div");
        Object.assign(vehicleScheduleContainer.style, {
            display: "flex",
            flexDirection: "column",
            flexBasis: "content",
            whiteSpace: "nowrap",
        });
        return vehicleScheduleContainer;
    }

    static backgroundDiv = (): HTMLDivElement => {
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

    async initialize(): Promise<void> {
        await this.appendScheduleBars();
    }

    private appendScheduleBars = async () => {
        const start: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
        const end: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 23, 59, 59, 999);
        const totalMsOfMonth: number = end.getTime() - start.getTime();

        const reservationData: ReservationData[] = await window.sqlSelect.reservationData({ startDate: start, endDate: end });
        this.reservationDataArray = reservationData;

        this.reservationDataArray.forEach((reservationData: ReservationData) => {
            this.vehicleScheduleCells.forEach((vehicleScheduleCell) => {
                const reservationDisplayDiv: HTMLDivElement = vehicleScheduleCell.reservationScheduleDiv;
                if (reservationData.vehicleId === vehicleScheduleCell.vehicleId) {
                    const previousScheduleBar: HTMLDivElement | undefined = reservationDisplayDiv.lastElementChild as HTMLDivElement;
                    const previousScheduleBarWidth: number = previousScheduleBar ? previousScheduleBar.getBoundingClientRect().width : 0;

                    const newScheduleBar = new ScheduleBar({
                        reservationData: reservationData,
                        startMs: start.getTime(),
                        totalMsOfSchedule: totalMsOfMonth,
                        previousScheduleBarWidth: `${previousScheduleBarWidth}px`,
                        color: "green"
                    }).getScheduleBarElement();

                    reservationDisplayDiv.append(newScheduleBar);
                }
            });
        });
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
}

export { MonthCalendar }