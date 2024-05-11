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

        (async () => {
            this.appendScheduleCells();
            await this.appendScheduleBars({ calendarDateElement: calendarDateElement });
        })();
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

        await Promise.all(monthReservations.map((reservation: Reservation) => {
            const selectedVehicleId: number = Number(reservation.selectedVehicleId);
            for (let scheduleCell of scheduleCells) {
                const scheduleCellRentalCarId: number = Number(scheduleCell.getAttribute("data-rentalCar-id"));
                if (selectedVehicleId === scheduleCellRentalCarId && !reservation.isCanceled) {
                    const scheduleBar: ScheduleBar = new ScheduleBar({ calendarDateElement: calendarDateElement, reservation: reservation });
                    scheduleCell.appendChild(scheduleBar);
                }
            }
        }));
    }
}

customElements.define("visual-schedule", VisualSchedule);