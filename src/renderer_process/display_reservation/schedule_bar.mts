import { Reservation } from "../../@types/types";
import { getTimeString } from "../common_modules.mjs";

export class ScheduleBar extends HTMLElement {
    constructor(args: { calendarDateElement: Element, reservation: Reservation }) {
        super();

        const { calendarDateElement, reservation } = args;

        const scheduleBarStyle = this.scheduleBarStyle({ calendarDateElement: calendarDateElement, reservation: reservation });
        Object.assign(this.style, scheduleBarStyle);
        this.className = "card";

        const scheduleBarLabel: HTMLDivElement = this.scheduleBarLabel({ reservation: reservation });
        this.append(scheduleBarLabel);
    }

    scheduleBarStyle = (args: { calendarDateElement: Element, reservation: Reservation }) => {
        const { calendarDateElement, reservation } = args;

        const calendarStartTimestamp: number = Number(calendarDateElement.getAttribute("calendar-start-timestamp"));
        const calendarEndTimestamp: number = Number(calendarDateElement.getAttribute("calendar-end-timestamp"));

        const totalMsOfCalendar: number = calendarEndTimestamp - calendarStartTimestamp;

        const pickupDatetimeMs: number = new Date(reservation.pickupDatetime).getTime();
        const returnDatetimeMs: number = new Date(reservation.returnDatetime).getTime();

        const diffInTimeOfReservation: number = returnDatetimeMs - pickupDatetimeMs;

        const diffFromStart = `${((pickupDatetimeMs - calendarStartTimestamp) / totalMsOfCalendar) * 100}%`;
        const relativeWidth = `${(diffInTimeOfReservation / totalMsOfCalendar) * 100}%`;

        return {
            display: "flex",
            flexDirection: "row",
            position: "relative",
            left: diffFromStart,
            width: relativeWidth,
            height: "100%",
            backgroundColor: "green",
            whiteSpace: "nowrap",
            overflow: "hidden",
            border: "none",
            cursor: "default",
            userSelect: "none"
        }
    }

    scheduleBarLabel = (args: { reservation: Reservation }): HTMLDivElement => {
        const { reservation } = args;

        const scheduleBarLabel: HTMLDivElement = document.createElement("div");
        Object.assign(scheduleBarLabel.style, {
            display: "flex",
            flexDirection: "row",
            height: "100%"
        });

        const timeAndLocationContainer: HTMLDivElement = document.createElement("div");
        Object.assign(timeAndLocationContainer.style, {
            display: "grid"
        });

        const pickupTimeDiv: HTMLDivElement = document.createElement("div");
        Object.assign(pickupTimeDiv.style, {
            display: "flex",
            gridColumn: "1",
            gridRow: "1",
        });
        const pickupTimeDateObject: Date = new Date(reservation.pickupDatetime);
        const pickupTimeString: string = getTimeString({ dateObject: pickupTimeDateObject });
        pickupTimeDiv.textContent = pickupTimeString;

        const pickupLocationDiv: HTMLDivElement = document.createElement("div");
        Object.assign(pickupLocationDiv.style, {
            display: "flex",
            gridColumn: "2",
            gridRow: "1",
            paddingLeft: "5px"
        });
        pickupLocationDiv.textContent = reservation.pickupLocation;

        const returnTimeDiv: HTMLDivElement = document.createElement("div");
        Object.assign(returnTimeDiv.style, {
            display: "flex",
            gridColumn: "1",
            gridRow: "2"
        });
        const returnDateObject: Date = new Date(reservation.returnDatetime);
        const returnTimeString: string = getTimeString({ dateObject: returnDateObject });
        returnTimeDiv.textContent = returnTimeString;

        const returnLocationDiv: HTMLDivElement = document.createElement("div");
        Object.assign(returnLocationDiv.style, {
            display: "flex",
            gridColumn: "2",
            gridRow: "2",
            paddingLeft: "5px"
        });
        returnLocationDiv.textContent = reservation.returnLocation;

        const reservationNameDiv: HTMLDivElement = document.createElement("div");
        Object.assign(reservationNameDiv.style, {
            display: "flex",
            padding: "1em"
        });
        reservationNameDiv.textContent = `${reservation.userName} 様`;

        timeAndLocationContainer.append(pickupTimeDiv, pickupLocationDiv, returnTimeDiv, returnLocationDiv);

        scheduleBarLabel.append(timeAndLocationContainer, reservationNameDiv);

        return scheduleBarLabel;
    }
}

customElements.define("schedule-bar", ScheduleBar);