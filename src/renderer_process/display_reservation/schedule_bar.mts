import { MouseInputEvent } from "electron";
import { ReservationData } from "../../@types/types";
import { getMonthName } from "../common_modules.mjs";

export const ScheduleBar = class {
    static scheduleBars: {
        reservationData: ReservationData,
        divElement: HTMLDivElement
    }[] = [];

    scheduleBarInfo: {
        reservationData: ReservationData,
        scheduleBarElement: HTMLDivElement,
        modalBackground: HTMLDivElement | undefined
    }

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

        this.scheduleBarInfo.reservationData = reservationData;
        this.startMsOfCalendar = startMsOfCalendar;
        this.totalMsOfCalendar = totalMsOfCalendar;
        this.previousScheduleBarWidth = previousScheduleBarWidth;
        this.scheduleBarColor = scheduleBarColor;

        const body: HTMLBodyElement = document.querySelector("body");

        scheduleBar.addEventListener("click", (event: MouseEvent) => {
            const modalBackgroundDiv: HTMLDivElement = ModalBackgroundDiv();
            const reservationInfoModal: HTMLDivElement = this.reservationInfoModalDiv(event);

            modalBackgroundDiv.append(reservationInfoModal);
            body.append(modalBackgroundDiv);

            this.scheduleBarInfo.modalBackground = modalBackgroundDiv;
        }, false);

        window.addEventListener("click", (event: MouseEvent) => {
            if (event.target === this.scheduleBarInfo.modalBackground) {
                this.scheduleBarInfo.modalBackground.remove();
                this.scheduleBarInfo.modalBackground = undefined;
            }
        }, false);

        scheduleBar.addEventListener("contextmenu", async () => {
            await window.contextMenu.scheduleBar(reservationData.id);
        }, false);

        const scheduleBarInfo = {
            reservationData: reservationData,
            divElement: scheduleBar
        }

        ScheduleBar.scheduleBars.push(scheduleBarInfo);
    }

    ScheduleBar = (): HTMLDivElement => {
        const scheduleBar: HTMLDivElement = document.createElement("div");
        scheduleBar.className = "card";

        const scheduleBarDepartureDatetime: number = this.scheduleBarInfo.reservationData.pickupDateObject.getTime();
        const scheduleBarReturnDatetime: number = this.scheduleBarInfo.reservationData.returnDateObject.getTime();

        const diffInTime: number = scheduleBarReturnDatetime - scheduleBarDepartureDatetime;
        const relativeWidth = `${(diffInTime / this.totalMsOfCalendar) * 100}%`;
        const diffFromStart = `${((scheduleBarDepartureDatetime - this.startMsOfCalendar) / this.totalMsOfCalendar) * 100}%`;

        Object.assign(scheduleBar.style, {
            display: "flex",
            flexDirection: "row",
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
                display: "grid",
                height: "100%",
                width: "100px"
            });

            const PickupTimeDiv = (): HTMLDivElement => {
                const pickupTimeDiv: HTMLDivElement = document.createElement("div");
                Object.assign(pickupTimeDiv.style, {
                    display: "flex",
                    gridColumn: "1",
                    gridRow: "1"
                });

                const pickupDateObject: Date = this.scheduleBarInfo.reservationData.pickupDateObject;

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

                const returnDateObject: Date = this.scheduleBarInfo.reservationData.returnDateObject;

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

                const pickupLocation: string = this.scheduleBarInfo.reservationData.pickupLocation;

                pickupLocationDiv.textContent = pickupLocation;

                return pickupLocationDiv;
            }

            const ReturnLocationDiv = (): HTMLDivElement => {
                const returnLocationDiv: HTMLDivElement = document.createElement("div");
                Object.assign(returnLocationDiv.style, {
                    display: "flex",
                    gridColumn: "1",
                    gridRow: "2"
                });

                const returnLocation: string = this.scheduleBarInfo.reservationData.returnLocation;

                returnLocationDiv.textContent = returnLocation;

                return returnLocationDiv;
            }

            const pickupTimeDiv: HTMLDivElement = PickupTimeDiv();
            const returnTimeDiv: HTMLDivElement = ReturnTimeDiv();
            const pickupLocationDiv: HTMLDivElement = PickupLocationDiv();
            const returnLocationDiv: HTMLDivElement = ReturnLocationDiv();

            scheduleBarInfoContainer.append(pickupTimeDiv, returnTimeDiv, pickupLocationDiv, returnLocationDiv);

            return scheduleBarInfoContainer;
        }

        const scheduleBarInfoContainer: HTMLDivElement = ScheduleBarInfoContainer();

        scheduleBar.append(scheduleBarInfoContainer);

        return scheduleBar;
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

                const reservationName: string = this.scheduleBarInfo.reservationData.reservationName;
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

                const rentalCategory: string = this.scheduleBarInfo.reservationData.rentalCategory;

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
                    gridColumn: "1",
                    gridRow: "1"
                });

                const pickupLocation: string = this.scheduleBarInfo.reservationData.pickupLocation;
                pickupLocationDiv.textContent = pickupLocation;

                return pickupLocationDiv;
            }

            

            return textContainer;
        }

        return reservationDetailsModal;
    }

    const ReservationNameDiv = (): HTMLDivElement => {
        const reservationNameDiv: HTMLDivElement = document.createElement("div");
        Object.assign(reservationNameDiv.style, {
            padding: "1em"
        });

        const reservationName = `${this.scheduleBarInfo.reservationData.reservationName} 様`;

        reservationNameDiv.textContent = reservationName;

        return reservationNameDiv;
    }

    const DepartureDatetimeDiv = (): HTMLDivElement => {
        const departureDatetimeDiv: HTMLDivElement = document.createElement("div");
        Object.assign(departureDatetimeDiv.style, {
            display: "flex"
        });

        const departureDatetime: Date = this.scheduleBarInfo.reservationData.departureDatetime;

        const departureYear: number = departureDatetime.getFullYear();
        const departureMonthIndex: number = departureDatetime.getMonth();
        const departureMonth: string = getMonthName(departureMonthIndex);
        const departureDate: string = String(departureDatetime.getDate()).padStart(2, "0");
        const departureHours: number = departureDatetime.getHours();
        const departureMinutes: string = String(departureDatetime.getMinutes()).padStart(2, "0");

        departureDatetimeDiv.textContent = `出発時刻: ${departureYear}年${departureMonth}${departureDate}日 ${departureHours}:${departureMinutes}`;
        return departureDatetimeDiv;
    }
}

ReservationDetailsModalWindow = (event: MouseEvent): HTMLDivElement => {
    const reservationDetailsModalDiv: HTMLDivElement = document.createElement("div");
    reservationDetailsModalDiv.className = "card";
    Object.assign(reservationDetailsModalDiv.style, {
        display: "grid",
        zIndex: "2",
        backgroundColor: "green",
        position: "absolute",
        left: `${event.x}px`,
        top: `${event.y}px`
    });

    const ReservationNameDiv = (): HTMLDivElement => {
        const reservationNameDiv: HTMLDivElement = document.createElement("div");
        Object.assign(reservationNameDiv.style, {
            display: "flex"
        });
        reservationNameDiv.textContent = `${this.scheduleBarInfo.reservationData.reservationName} 様`;
        return reservationNameDiv;
    }



    return reservationDetailsModalDiv;
}

displayModalWindow = (event: Event): void => {
    // code to display modal widow goes on here.
}

const ReturnDatetimeDiv = (): HTMLDivElement => {
    const returnDatetimeDiv: HTMLDivElement = document.createElement("div");
    Object.assign(returnDatetimeDiv.style, {
        display: "flex"
    });

    const returnDatetime: Date = new Date(this.reservationData.returnDatetime);
    const returnMonthIndex: number = returnDatetime.getMonth();

    const returnYear: number = returnDatetime.getFullYear();
    const returnMonth: string = getMonthName(returnMonthIndex);
    const returnDate: string = String(returnDatetime.getDate()).padStart(2, "0");
    const returnHours: number = returnDatetime.getHours();
    const returnMinutes: string = String(returnDatetime.getMinutes()).padStart(2, "0");

    returnDatetimeDiv.textContent = `返却時刻: ${returnYear}年${returnMonth}${returnDate}日 ${returnHours}:${returnMinutes}`;
    return returnDatetimeDiv;
}

const DepartureStoreDiv = (): HTMLDivElement => {
    const departureStoreDiv: HTMLDivElement = document.createElement("div");
    Object.assign(departureStoreDiv.style, {
        display: "flex"
    });
    departureStoreDiv.textContent = this.reservationData.departureStore;
    return departureStoreDiv;
}

const ReturnStoreDiv = (): HTMLDivElement => {
    const returnStoreDiv: HTMLDivElement = document.createElement("div");
    Object.assign(returnStoreDiv.style, {
        display: "flex"
    });
    returnStoreDiv.textContent = this.reservationData.returnStore;
    return returnStoreDiv;
}

const RentalCategoryDiv = (): HTMLDivElement => {
    const rentalCategoryDiv: HTMLDivElement = document.createElement("div");
    Object.assign(rentalCategoryDiv.style, {
        display: "flex"
    });
    switch (this.reservationData.rentalCategory) {
        case "general-rental":
            rentalCategoryDiv.textContent = "貸出区分: 一般貸出"
            break;
        case "loaner-rental":
            rentalCategoryDiv.textContent = "貸出区分: 損保代車"
            break;
        case "booking":
            rentalCategoryDiv.textContent = "貸出区分: 仮押さえ"
    }
    return rentalCategoryDiv;
}

const NonSmokingDiv = (): HTMLDivElement => {
    const nonSmokingDiv: HTMLDivElement = document.createElement("div");
    Object.assign(nonSmokingDiv.style, {
        display: "flex"
    });
    switch (this.reservationData.nonSmoking) {
        case "non-smoking":
            nonSmokingDiv.textContent = "禁煙希望"
            break;
        case "ok-smoking":
            nonSmokingDiv.textContent = "喫煙希望"
            break;
        case "none-specification":
            nonSmokingDiv.textContent = "指定なし"
            break;
    }
    return nonSmokingDiv;
}

const reservationInfoModal: HTMLDivElement = ReservationInfoModal();
const reservationNameDiv: HTMLDivElement = ReservationNameDiv();
const departureStoreDiv: HTMLDivElement = DepartureStoreDiv();
const departureDatetimeDiv: HTMLDivElement = DepartureDatetimeDiv();
const returnStoreDiv: HTMLDivElement = ReturnStoreDiv();
const returnDatetimeDiv: HTMLDivElement = ReturnDatetimeDiv();
const rentalCategoryDiv: HTMLDivElement = RentalCategoryDiv();
const nonSmokingDiv: HTMLDivElement = NonSmokingDiv();

reservationInfoModal.append(
    reservationNameDiv,
    departureStoreDiv,
    departureDatetimeDiv,
    returnStoreDiv,
    returnDatetimeDiv,
    rentalCategoryDiv,
    nonSmokingDiv
);

return reservationInfoModal;
    }

getReservationData() {
    return this.reservationData;
}

getScheduleBarElement() {
    return this.scheduleBar;
}
}