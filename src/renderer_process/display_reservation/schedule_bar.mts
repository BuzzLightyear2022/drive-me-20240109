import { ReservationData } from "../../@types/types";

export type ScheduleBarType = InstanceType<typeof ScheduleBar>;

export const ScheduleBar = class {
    scheduleBarElement: HTMLDivElement;
    modalBackground: HTMLDivElement;
    reservationData: ReservationData;
    startMsOfCalendar: number;
    totalMsOfCalendar: number;
    previousScheduleBarWidth: number;
    scheduleBarColor: string

    constructor(args: {
        reservationData: ReservationData,
        startMsOfCalendar: number,
        totalMsOfCalendar: number,
        previousScheduleBarWidth: number,
        scheduleBarColor: string
    }) {
        const {
            reservationData,
            startMsOfCalendar,
            totalMsOfCalendar,
            previousScheduleBarWidth,
            scheduleBarColor
        } = args;

        this.reservationData = reservationData;
        this.startMsOfCalendar = startMsOfCalendar;
        this.totalMsOfCalendar = totalMsOfCalendar;
        this.previousScheduleBarWidth = previousScheduleBarWidth;
        this.scheduleBarColor = scheduleBarColor;
    }

    createScheduleBar = (): void => {
        this.scheduleBarElement = document.createElement("div");
        this.scheduleBarElement.className = "card";

        const scheduleBarDepartureDatetime: number = new Date(this.reservationData.pickupDateObject).getTime();
        const scheduleBarReturnDatetime: number = new Date(this.reservationData.returnDateObject).getTime();

        const diffInTime: number = scheduleBarReturnDatetime - scheduleBarDepartureDatetime;
        const relativeWidth = `${(diffInTime / this.totalMsOfCalendar) * 100}%`;
        const diffFromStart = `${((scheduleBarDepartureDatetime - this.startMsOfCalendar) / this.totalMsOfCalendar) * 100}%`;

        Object.assign(this.scheduleBarElement.style, {
            display: "flex",
            flexDirection: "row",
            flexShrink: 0,
            position: "relative",
            width: relativeWidth,
            height: "100%",
            left: `calc(${diffFromStart} - ${this.previousScheduleBarWidth}px`,
            backgroundColor: this.scheduleBarColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default",
            userSelect: "none"
        });

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

                    const pickupDateObject: Date = new Date(this.reservationData.pickupDateObject);

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

                    const returnDateObject: Date = new Date(this.reservationData.returnDateObject);

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
                reservationNameDiv.textContent = `${this.reservationData.reservationName} 様`;

                return reservationNameDiv;
            }

            const timeAndLocationContainer: HTMLDivElement = TimeAndLocationContainer();
            const reservationNameDiv: HTMLDivElement = ReservationNameDiv();

            scheduleBarInfoContainer.append(timeAndLocationContainer, reservationNameDiv);

            return scheduleBarInfoContainer;
        }

        const scheduleBarInfoContainer: HTMLDivElement = ScheduleBarInfoContainer();

        this.scheduleBarElement.append(scheduleBarInfoContainer);

        this.scheduleBarElement.addEventListener("contextmenu", this.displayContextmenu, false);
    }

    displayContextmenu = () => {
        window.contextMenu.scheduleBar(this.reservationData.id);
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

                const reservationName: string = this.reservationData.reservationName;
                const reservationNameString = `${reservationName} 様`;

                reservationNameDiv.textContent = reservationNameString;

                return reservationNameDiv;
            }

            const RentalCategoryDiv = (): HTMLDivElement => {
                const rentalCategoryDiv: HTMLDivElement = document.createElement("div");
                Object.assign(rentalCategoryDiv.style, {
                    display: "flex",
                    gridColumn: "1",
                    gridRow: "2"
                });

                const rentalCategory: string = this.reservationData.rentalCategory;

                switch (rentalCategory) {
                    case "generalRental":
                        rentalCategoryDiv.textContent = "一般貸出";
                        break;
                    case "loanerRental":
                        rentalCategoryDiv.textContent = "損保貸出";
                        break;
                    case "booking":
                        rentalCategoryDiv.textContent = "仮押さえ";
                        break;
                }

                return rentalCategoryDiv;
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

                const pickupDatetime: Date = this.reservationData.pickupDateObject;

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