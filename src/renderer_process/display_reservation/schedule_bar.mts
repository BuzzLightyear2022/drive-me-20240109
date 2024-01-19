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

        const DepartureAndReturnInfoDiv = () => {
            const departureAndReturnInfoDiv: HTMLDivElement = document.createElement("div");
            Object.assign(departureAndReturnInfoDiv.style, {
                display: "grid",
                height: "100%",
                width: "100px"
            });

            const DepartureTimeDiv = () => {
                const departureDatetime: Date = new Date(this.scheduleBarInfo.reservationData.departureDatetime);
                const departureHour = String(departureDatetime.getHours());
                const departureMinutes: string = String(departureDatetime.getMinutes()).padStart(2, "0");
                const departureTime = `${departureHour}:${departureMinutes}`;

                const departureTimeDiv: HTMLDivElement = document.createElement("div");
                Object.assign(departureTimeDiv.style, {
                    gridRow: "1",
                    gridColumn: "1"
                });
                departureTimeDiv.textContent = departureTime;

                return departureTimeDiv;
            }

            const DepartureStoreDiv = () => {
                const departureStore: string = this.scheduleBarInfo.reservationData.departureStore;
                const departureStoreDiv: HTMLDivElement = document.createElement("div");
                Object.assign(departureStoreDiv.style, {
                    gridRow: "1",
                    gridColumn: "2"
                });
                departureStoreDiv.textContent = departureStore;
                return departureStoreDiv;
            }

            const ReturnTimeDiv = () => {
                const returnDatetime: Date = new Date(this.scheduleBarInfo.reservationData.returnDatetime);
                const returnHour = String(returnDatetime.getHours());
                const returnMinutes: string = String(returnDatetime.getMinutes()).padStart(2, "0");
                const returnTime = `${returnHour}:${returnMinutes}`;
                const returnTimeDiv: HTMLDivElement = document.createElement("div");
                Object.assign(returnTimeDiv.style, {
                    gridRow: "2",
                    gridColumn: "1"
                });
                returnTimeDiv.textContent = returnTime;

                return returnTimeDiv;
            }

            const ReturnStoreDiv = () => {
                const returnStore: string = this.scheduleBarInfo.reservationData.returnStore;
                const returnStoreDiv: HTMLDivElement = document.createElement("div");
                Object.assign(returnStoreDiv.style, {
                    gridRow: "2",
                    gridColumn: "2"
                });
                returnStoreDiv.textContent = returnStore;
                return returnStoreDiv;
            }
        }

        const ModalBackgroundDiv = (): HTMLDivElement => {
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

        const body: HTMLBodyElement = document.querySelector("body");

        const departureDatetime: Date = new Date(reservationData.departureDatetime);
        const returnDatetime: Date = new Date(reservationData.returnDatetime);

        const diffInTime: number = returnDatetime.getTime() - departureDatetime.getTime();
        const relativeWidth = `${(diffInTime / this.totalMsOfCalendar) * 100}%`;
        const diffFromStart = `${((departureDatetime.getTime() - startMsOfCalendar) / totalMsOfCalendar) * 100}%`;

        const scheduleBar: HTMLDivElement = document.createElement("div");
        scheduleBar.className = "card";
        Object.assign(scheduleBar.style, {
            display: "flex",
            flexDirection: "row",
            position: "relative",
            height: "100%",
            width: relativeWidth,
            left: `calc(${diffFromStart} - ${previousScheduleBarWidth}`,
            backgroundColor: color,
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "default",
            userSelect: "none",
        });

        const departureAndReturnInfoDiv: HTMLDivElement = DepartureReturnInfoDiv();
        const reservationNameDiv: HTMLDivElement = this.reservationNameDiv();

        scheduleBar.append(departureReturnInfoDiv, reservationNameDiv);

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

    appendScheduleBar = (): void => {
        const body: HTMLBodyElement = document.querySelector("body");

        const ScheduleBar = (): HTMLDivElement => {
            const scheduleBar: HTMLDivElement = document.createElement("div");
            scheduleBar.className = "card";

            const scheduleBarReturnDatetime: number = this.scheduleBarInfo.reservationData.returnDatetime.getTime();
            const scheduleBarDepartureDatetime: number = this.scheduleBarInfo.reservationData.departureDatetime.getTime();

            const diffInTime: number = scheduleBarReturnDatetime - scheduleBarDepartureDatetime;
            const relativeWidth = `${(diffInTime / this.totalMsOfCalendar) * 100}%`;
            const diffFromStart = `${((scheduleBarDepartureDatetime - this.startMsOfCalendar) / this.totalMsOfCalendar) * 100}%`;

            Object.assign(scheduleBar.style, {
                display: "flex",
                flexDirection: "row",
                position: "relative",
                height: "100%",
                width: relativeWidth,
                left: `calc(${diffFromStart} - ${this.previousScheduleBarWidth}px`,
                backgroundColor: this.scheduleBarColor,
                whiteSpace: "nowrap",
                overflow: "hidden",
                cursor: "default",
                userSelect: "none",
            });

            return scheduleBar;
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
    }

    displayModalWindow = (mouseEvent: MouseInputEvent): void => {
        const ReservationDetailsModalDiv = (): HTMLDivElement => {
            const reservationDetailsModalDiv: HTMLDivElement = document.createElement("div");
            reservationDetailsModalDiv.className = "card";
            Object.assign(reservationDetailsModalDiv.style, {
                display: "grid",
                zIndex: "2",
                backgroundColor: "green",
                position: "absolute",
                left: `${mouseEvent.x}px`,
                top: `${mouseEvent.y}px`
            });

            return reservationDetailsModalDiv;
        }


    }

    const ReservationNameDiv = (): HTMLDivElement => {
        const reservationNameDiv: HTMLDivElement = document.createElement("div");
        Object.assign(reservationNameDiv.style, {
            display: "flex"
        });
        reservationNameDiv.textContent = `${this.reservationData.reservationName} 様`;
        return reservationNameDiv;
    }

    const DepartureDatetimeDiv = (): HTMLDivElement => {
        const departureDatetimeDiv: HTMLDivElement = document.createElement("div");
        Object.assign(departureDatetimeDiv.style, {
            display: "flex"
        });

        const departureDatetime: Date = new Date(this.reservationData.departureDatetime);
        const departureMonthIndex: number = departureDatetime.getMonth();

        const departureYear: number = departureDatetime.getFullYear();
        const departureMonth: string = getMonthName(departureMonthIndex);
        const departureDate: string = String(departureDatetime.getDate()).padStart(2, "0");
        const departureHours: number = departureDatetime.getHours();
        const departureMinutes: string = String(departureDatetime.getMinutes()).padStart(2, "0");

        departureDatetimeDiv.textContent = `出発時刻: ${departureYear}年${departureMonth}${departureDate}日 ${departureHours}:${departureMinutes}`;
        return departureDatetimeDiv;
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