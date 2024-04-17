import { ReservationData } from "../../@types/types";

export type ScheduleBarType = InstanceType<typeof ScheduleBar>;

export const ScheduleBar = class {
    scheduleBarElement: HTMLDivElement;
    modalBackground: HTMLDivElement;
    reservationData: ReservationData;
    startMsOfCalendar: number;
    endMsOfCalendar: number;
    previousScheduleBarWidth: number;
    scheduleBarColor: string

    constructor(args: {
        reservationData: ReservationData,
        startMsOfCalendar: number,
        endMsOfCalendar: number,
        previousScheduleBarWidth: number,
        scheduleBarColor: string
    }) {
        const {
            reservationData,
            startMsOfCalendar,
            endMsOfCalendar,
            previousScheduleBarWidth,
            scheduleBarColor
        } = args;

        this.reservationData = reservationData;
        this.startMsOfCalendar = startMsOfCalendar;
        this.endMsOfCalendar = endMsOfCalendar;
        this.previousScheduleBarWidth = previousScheduleBarWidth;
        this.scheduleBarColor = scheduleBarColor;
    }

    createScheduleBar = (): void => {
        const ScheduleBarInfoContainer = (): HTMLDivElement => {
            const scheduleBarInfoContainer: HTMLDivElement = document.createElement("div");
            Object.assign(scheduleBarInfoContainer.style, {
                display: "flex",
                flexDirection: "row",
                height: "100%",
            });

            const TimeAndLocationContainer = (): HTMLDivElement => {
                const timeAndLocationContainer: HTMLDivElement = document.createElement("div");
                Object.assign(timeAndLocationContainer.style, {
                    display: "grid"
                });

                const PickupTimeDiv = (): HTMLDivElement => {
                    const pickupTimeDiv: HTMLDivElement = document.createElement("div");
                    Object.assign(pickupTimeDiv.style, {
                        display: "flex",
                        gridColumn: "1",
                        gridRow: "1"
                    });

                    const pickupDateObject: Date = new Date(this.reservationData.pickupDatetime);

                    const pickupHours: number = pickupDateObject.getHours();
                    const pickupMinutes: number = pickupDateObject.getMinutes();

                    const pickupMinutesString: string = String(pickupMinutes).padStart(2, "0");

                    const pickupTimeString = `${pickupHours}:${pickupMinutesString}`;

                    pickupTimeDiv.textContent = pickupTimeString;

                    return pickupTimeDiv;
                }

                const ReturnTimeDiv = (): HTMLDivElement => {
                    const returnTimeDiv: HTMLDivElement = document.createElement("div");
                    Object.assign(returnTimeDiv.style, {
                        display: "flex",
                        gridColumn: "1",
                        gridRow: "2"
                    });

                    const returnDateObject: Date = new Date(this.reservationData.returnDatetime);

                    const returnHours: number = returnDateObject.getHours();
                    const returnMinutes: number = returnDateObject.getMinutes();

                    const returnMinutesString: string = String(returnMinutes).padStart(2, "0");

                    const returnTimeString = `${returnHours}:${returnMinutesString}`;

                    returnTimeDiv.textContent = returnTimeString;

                    return returnTimeDiv;
                }

                const PickupLocationDiv = (): HTMLDivElement => {
                    const pickupLocationDiv: HTMLDivElement = document.createElement("div");
                    Object.assign(pickupLocationDiv.style, {
                        display: "flex",
                        gridColumn: "2",
                        gridRow: "1"
                    });

                    const pickupLocation: string = this.reservationData.pickupLocation;

                    pickupLocationDiv.textContent = pickupLocation;

                    return pickupLocationDiv;
                }

                const ReturnLocationDiv = (): HTMLDivElement => {
                    const returnLocationDiv: HTMLDivElement = document.createElement("div");
                    Object.assign(returnLocationDiv.style, {
                        display: "flex",
                        gridColumn: "2",
                        gridRow: "2"
                    });

                    const returnLocation: string = this.reservationData.returnLocation;

                    returnLocationDiv.textContent = returnLocation;

                    return returnLocationDiv;
                }

                const pickupTimeDiv: HTMLDivElement = PickupTimeDiv();
                const returnTimeDiv: HTMLDivElement = ReturnTimeDiv();
                const pickupLocationDiv: HTMLDivElement = PickupLocationDiv();
                const returnLocationDiv: HTMLDivElement = ReturnLocationDiv();

                timeAndLocationContainer.append(pickupTimeDiv, returnTimeDiv, pickupLocationDiv, returnLocationDiv);

                return timeAndLocationContainer;
            }

            const ReservationNameDiv = (): HTMLDivElement => {
                const reservationNameDiv: HTMLDivElement = document.createElement("div");
                Object.assign(reservationNameDiv.style, {
                    display: "flex",
                    padding: "1em"
                });
                reservationNameDiv.textContent = `${this.reservationData.userName} 様`;

                return reservationNameDiv;
            }

            const timeAndLocationContainer: HTMLDivElement = TimeAndLocationContainer();
            const reservationNameDiv: HTMLDivElement = ReservationNameDiv();

            scheduleBarInfoContainer.append(timeAndLocationContainer, reservationNameDiv);

            return scheduleBarInfoContainer;
        }

        this.scheduleBarElement = document.createElement("div");
        this.scheduleBarElement.className = "card";

        const totalMsOfCalendar: number = this.endMsOfCalendar - this.startMsOfCalendar;

        const pickupDateMs: number = new Date(this.reservationData.pickupDatetime).getTime();
        const returnDateMs: number = new Date(this.reservationData.returnDatetime).getTime();

        const diffInTime: number = returnDateMs - pickupDateMs;
        const relativeWidth = `${(diffInTime / totalMsOfCalendar) * 100}%`;
        const diffFromStart = `${((pickupDateMs - this.startMsOfCalendar) / totalMsOfCalendar) * 100}%`;

        const commonStyle = {
            display: "flex",
            flexDirection: "row",
            position: "relative",
            height: "100%",
            backgroundColor: this.scheduleBarColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            border: "none",
            cursor: "default",
            userSelect: "none"
        };

        if (pickupDateMs <= this.startMsOfCalendar && returnDateMs >= this.endMsOfCalendar) {
            Object.assign(this.scheduleBarElement.style, {
                ...commonStyle,
                width: "100%",
                left: "0px",
            });
        } else if (pickupDateMs >= this.startMsOfCalendar && returnDateMs >= this.endMsOfCalendar) {
            Object.assign(this.scheduleBarElement.style, {
                ...commonStyle,
                width: relativeWidth,
                left: diffFromStart,
                zIndex: "1"
            });
        } else {
            Object.assign(this.scheduleBarElement.style, {
                ...commonStyle,
                flexShrink: 0,
                width: relativeWidth,
                left: `calc(${diffFromStart} - ${this.previousScheduleBarWidth}px)`,
            });
        }

        const scheduleBarInfoContainer: HTMLDivElement = ScheduleBarInfoContainer();

        this.scheduleBarElement.append(scheduleBarInfoContainer);

        this.scheduleBarElement.addEventListener("contextmenu", this.displayContextmenu, false);
    }

    displayContextmenu = (event: Event) => {
        window.contextmenu.scheduleBar(this.reservationData.id);
        event.stopPropagation();
    }

    ModalBackgroundDiv = (): HTMLDivElement => {
        const modalBackgroundDiv: HTMLDivElement = document.createElement("div");
        Object.assign(modalBackgroundDiv.style, {
            display: "block",
            width: "100%",
            height: "100%",
            left: "0",
            top: "0",
            position: "fixed",
            zIndex: "1"
        })
        return modalBackgroundDiv;
    }

    ReservationDetailsModal = (): HTMLDivElement => {
        const reservationDetailsModal: HTMLDivElement = document.createElement("div");
        reservationDetailsModal.className = "card";
        Object.assign(reservationDetailsModal.style, {
            display: "flex"
        });

        const TextContainer = (): HTMLDivElement => {
            const textContainer: HTMLDivElement = document.createElement("div");
            Object.assign(textContainer.style, {
                display: "grid"
            });

            const ReservationNameDiv = (): HTMLDivElement => {
                const reservationNameDiv: HTMLDivElement = document.createElement("div");
                Object.assign(reservationNameDiv.style, {
                    display: "flex",
                    gridColumn: "1",
                    gridRow: "1"
                });

                const reservationName: string = this.reservationData.applicantName;
                const reservationNameString = `${reservationName} 様`;

                reservationNameDiv.textContent = reservationNameString;

                return reservationNameDiv;
            }

            const PickupLocationDiv = (): HTMLDivElement => {
                const pickupLocationDiv: HTMLDivElement = document.createElement("div");
                Object.assign(pickupLocationDiv.style, {
                    display: "flex",
                    gridColumn: "2",
                    gridRow: "1"
                });

                const pickupLocation: string = this.reservationData.pickupLocation;
                pickupLocationDiv.textContent = pickupLocation;

                return pickupLocationDiv;
            }

            const ReturnLocationDiv = (): HTMLDivElement => {
                const returnLocationDiv: HTMLDivElement = document.createElement("div");
                Object.assign(returnLocationDiv.style, {
                    display: "flex",
                    gridColumn: "2",
                    gridRow: "4"
                });

                return returnLocationDiv;
            }

            const pickupDatetimeDiv = (): HTMLDivElement => {
                const pickupDatetimeDiv: HTMLDivElement = document.createElement("div");
                Object.assign(pickupDatetimeDiv.style, {
                    display: "flex",
                    gridColumn: "1",
                    gridRow: "1"
                });

                const pickupDatetime: Date = this.reservationData.pickupDatetime;

                return pickupDatetimeDiv;
            }

            const reservationNameDiv: HTMLDivElement = ReservationNameDiv();

            textContainer.append(reservationNameDiv);

            return textContainer;
        }

        const textContainer: HTMLDivElement = TextContainer();

        reservationDetailsModal.append(textContainer);

        return reservationDetailsModal;
    }

    displayModalWindow = (event: Event): void => {
        // code to display modal widow goes on here.
    }
}