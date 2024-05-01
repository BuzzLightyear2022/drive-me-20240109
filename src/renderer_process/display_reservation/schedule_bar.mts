import { Reservation } from "../../@types/types";
import { getTimeString } from "../common_modules.mjs";

export class ScheduleBar extends HTMLElement {
    reservationId: string;
    reservation: Reservation;

    constructor(args: { calendarDateElement: Element, reservation: Reservation }) {
        super();

        const { calendarDateElement, reservation } = args;

        this.reservationId = reservation.id;
        this.reservation = reservation

        const scheduleBarStyle = this.scheduleBarStyle({ calendarDateElement: calendarDateElement, reservation: reservation });
        Object.assign(this.style, scheduleBarStyle);
        this.className = "card";

        const scheduleBarLabel: HTMLDivElement = this.scheduleBarLabel();
        this.append(scheduleBarLabel);

        this.addEventListener("contextmenu", this.contextmenuHandler, false);
    }

    contextmenuHandler = {
        handleEvent: (event: Event) => {
            window.contextmenu.scheduleBar(this.reservationId);
        }
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

    scheduleBarLabel = (): HTMLDivElement => {
        const scheduleBarLabel: HTMLDivElement = document.createElement("div");
        Object.assign(scheduleBarLabel.style, {
            display: "flex",
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
            margin: "auto 0"
        });

        const timeAndLocationContainer: HTMLDivElement = this.timeAndLocationContainer();
        const reservationNameContainer: HTMLDivElement = this.reservationNameContainer();

        scheduleBarLabel.append(timeAndLocationContainer, reservationNameContainer);

        return scheduleBarLabel;
    }

    timeAndLocationContainer = (): HTMLDivElement => {
        const timeAndLocationContainer: HTMLDivElement = document.createElement("div");
        Object.assign(timeAndLocationContainer.style, {
            display: "grid",
        });

        const pickupTimeDiv: HTMLDivElement = document.createElement("div");
        Object.assign(pickupTimeDiv.style, {
            display: "flex",
            gridColumn: "1",
            gridRow: "1",
        });
        const pickupTimeDateObject: Date = new Date(this.reservation.pickupDatetime);
        const pickupTimeString: string = getTimeString({ dateObject: pickupTimeDateObject });
        pickupTimeDiv.textContent = pickupTimeString;

        const pickupLocationDiv: HTMLDivElement = document.createElement("div");
        Object.assign(pickupLocationDiv.style, {
            display: "flex",
            gridColumn: "2",
            gridRow: "1",
            marginLeft: "5px"
        });
        pickupLocationDiv.textContent = this.reservation.pickupLocation;

        const returnTimeDiv: HTMLDivElement = document.createElement("div");
        Object.assign(returnTimeDiv.style, {
            display: "flex",
            gridColumn: "1",
            gridRow: "2"
        });
        const returnDateObject: Date = new Date(this.reservation.returnDatetime);
        const returnTimeString: string = getTimeString({ dateObject: returnDateObject });
        returnTimeDiv.textContent = returnTimeString;

        const returnLocationDiv: HTMLDivElement = document.createElement("div");
        Object.assign(returnLocationDiv.style, {
            display: "flex",
            gridColumn: "2",
            gridRow: "2",
            marginLeft: "5px"
        });
        returnLocationDiv.textContent = this.reservation.returnLocation;

        timeAndLocationContainer.append(pickupTimeDiv, pickupLocationDiv, returnTimeDiv, returnLocationDiv);

        return timeAndLocationContainer;
    }

    reservationNameContainer = (): HTMLDivElement => {
        const reservationNameContainer: HTMLDivElement = document.createElement("div");
        Object.assign(reservationNameContainer.style, {
            display: "flex",
            marginLeft: "5px"
        });

        reservationNameContainer.textContent = `${this.reservation.userName} 様`;

        return reservationNameContainer;
    }
}

customElements.define("schedule-bar", ScheduleBar);