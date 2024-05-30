import { Reservation } from "../../@types/types";
import { getTimeString, getDateString } from "../common_modules/common_modules.mjs";

export class ScheduleBar extends HTMLElement {
    reservationId: string;
    reservation: Reservation;

    constructor(args: { calendarDateElement: Element, reservation: Reservation }) {
        super();

        const { calendarDateElement, reservation } = args;

        this.reservationId = reservation.id;
        this.reservation = reservation;
        this.setAttribute("data-reservation-id", this.reservationId);

        const scheduleBarStyle = this.scheduleBarStyle({ calendarDateElement: calendarDateElement, reservation: reservation });
        Object.assign(this.style, scheduleBarStyle);

        const scheduleBarLabel: HTMLDivElement = this.scheduleBarLabel();
        this.append(scheduleBarLabel);

        this.addEventListener("contextmenu", this.contextmenuHandler, false);
        this.addEventListener("click", this.reservationDetailsModalHandler, false);
    }

    contextmenuHandler = {
        handleEvent: (event: Event) => {
            event.stopPropagation();
            window.contextmenu.scheduleBar(this.reservationId);
        }
    }

    reservationDetailsModalHandler = {
        handleEvent: (event: MouseEvent) => {
            const body: HTMLBodyElement = document.querySelector("body");

            const modalBackground: HTMLDivElement = this.modalBackground();
            const reservationDetails: HTMLDivElement = this.reservationDetails({ event });

            modalBackground.append(reservationDetails);
            body.append(modalBackground);
        }
    }

    scheduleBarStyle = (args: { calendarDateElement: Element, reservation: Reservation }) => {
        const { calendarDateElement, reservation } = args;

        const commonStyle = {
            display: "flex",
            flexDirection: "row",
            position: "relative",
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default",
            userSelect: "none"
        }

        const calendarStartTimestamp: number = Number(calendarDateElement.getAttribute("calendar-start-timestamp"));
        const calendarEndTimestamp: number = Number(calendarDateElement.getAttribute("calendar-end-timestamp"));

        const totalMsOfCalendar: number = calendarEndTimestamp - calendarStartTimestamp;

        const pickupDatetimeMs: number = new Date(reservation.pickupDatetime).getTime();
        const returnDatetimeMs: number = new Date(reservation.returnDatetime).getTime();

        const diffInTimeOfReservation: number = returnDatetimeMs - pickupDatetimeMs;
        const diffFromStart = `${((pickupDatetimeMs - calendarStartTimestamp) / totalMsOfCalendar) * 100}%`;
        const relativeWidth = `${(diffInTimeOfReservation / totalMsOfCalendar) * 100}%`;

        if (pickupDatetimeMs >= calendarStartTimestamp && returnDatetimeMs <= calendarEndTimestamp) {
            return {
                ...commonStyle,
                left: diffFromStart,
                width: relativeWidth,
                borderRadius: "5px",
                backgroundColor: "green"
            }
        } else if (pickupDatetimeMs >= calendarStartTimestamp && returnDatetimeMs >= calendarEndTimestamp) {
            return {
                ...commonStyle,
                left: diffFromStart,
                width: `calc(100% - ${diffFromStart})`,
                borderTopLeftRadius: "5px",
                borderBottomLeftRadius: "5px",
                backgroundColor: "yellow"
            }
        } else if (pickupDatetimeMs <= calendarStartTimestamp && returnDatetimeMs <= calendarEndTimestamp) {
            return {
                ...commonStyle,
                left: "0%",
                width: `calc(${relativeWidth} + ${diffFromStart})`,
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
                backgroundColor: "red"
            }
        } else {
            return {
                ...commonStyle,
                left: "0%",
                width: "100%",
                backgroundColor: "blue"
            }
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

    timeAndLocationContainer = (date: boolean = false): HTMLDivElement => {
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
        const pickupDateString: string = getDateString({ dateObject: pickupTimeDateObject });
        const pickupTimeString: string = getTimeString({ dateObject: pickupTimeDateObject });
        pickupTimeDiv.textContent = date ? `${pickupDateString} ${pickupTimeString}` : pickupTimeString;

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
        const returnDateString: string = getDateString({ dateObject: returnDateObject });
        const returnTimeString: string = getTimeString({ dateObject: returnDateObject });
        returnTimeDiv.textContent = date ? `${returnDateString} ${returnTimeString}` : returnTimeString;

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

    modalBackground = (): HTMLDivElement => {
        const modalBackground: HTMLDivElement = document.createElement("div");

        Object.assign(modalBackground.style, {
            display: "block",
            width: "100%",
            height: "100%",
            left: "0",
            top: "0",
            position: "fixed",
            zIndex: "1",
        });

        modalBackground.addEventListener("click", () => {
            modalBackground.parentElement.removeChild(modalBackground);
        });

        return modalBackground
    }

    reservationDetails = (args: { event: MouseEvent }): HTMLDivElement => {
        const { event } = args;

        const reservationDetails: HTMLDivElement = document.createElement("div");
        Object.assign(reservationDetails.style, {
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            border: "solid",
            borderRadius: "5px",
            left: `${event.x}px`,
            top: `${event.y}px`,
            backgroundColor: "green",
            zIndex: "2"
        });

        const reservationNameContainer: HTMLDivElement = this.reservationNameContainer();

        const timeAndLocationContainer: HTMLDivElement = this.timeAndLocationContainer(true);

        reservationDetails.append(reservationNameContainer, timeAndLocationContainer);

        return reservationDetails;
    }
}

customElements.define("schedule-bar", ScheduleBar);