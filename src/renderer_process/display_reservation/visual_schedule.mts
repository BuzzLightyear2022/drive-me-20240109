import { Reservation } from "../../@types/types";
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
            const pickupTimestamp: number = new Date(reservation.pickupDatetime).getTime();
            const returnTimestamp: number = new Date(reservation.returnDatetime).getTime();

            for (let scheduleCell of scheduleCells) {
                const scheduleCellVehicleId: number = Number(scheduleCell.getAttribute("data-vehicle-id"));

                if (selectedVehicleId === scheduleCellVehicleId) {
                    // if (pickupTimestamp >= calendarStartTimestamp && returnTimestamp <= calendarEndTimestamp) {
                    //     const scheduleBar: ScheduleBar = new ScheduleBar({ calendarDateElement: calendarDateElement, reservation: reservation });
                    //     scheduleCell.append(scheduleBar);
                    // } else if (pickupTimestamp ) {

                    // }

                    const scheduleBar: ScheduleBar = new ScheduleBar({ calendarDateElement: calendarDateElement, reservation: reservation });
                    scheduleCell.appendChild(scheduleBar);
                }
            }
        });
    }
}

customElements.define("visual-schedule", VisualSchedule);