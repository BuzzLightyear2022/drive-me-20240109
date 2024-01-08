import { ReservationData, ScheduleBarInfo } from "../../@types/types";
import { getMonthName } from "../common_modules.mjs";

const ScheduleBar = class {
    static scheduleBars: ScheduleBarInfo[] = [];
    reservationData: ReservationData;
    scheduleBar: HTMLDivElement;
    modalBackground: HTMLDivElement;

    constructor(args: {
        reservationData: ReservationData,
        startMs: number,
        totalMsOfSchedule: number,
        previousScheduleBarWidth: string,
        color: string
    }) {
        const { reservationData, startMs, totalMsOfSchedule, previousScheduleBarWidth, color } = args;

        this.reservationData = reservationData;

        const body: HTMLBodyElement = document.querySelector("body");

        const departureDatetime: Date = new Date(reservationData.departureDatetime);
        const returnDatetime: Date = new Date(reservationData.returnDatetime);

        const diffInTime: number = returnDatetime.getTime() - departureDatetime.getTime();
        const relativeWidth = `${(diffInTime / totalMsOfSchedule) * 100}%`;
        const diffFromStart = `${((departureDatetime.getTime() - startMs) / totalMsOfSchedule) * 100}%`;

        const scheduleBar: HTMLDivElement = document.createElement("div");
        Object.assign(scheduleBar.style, {
            display: "flex",
            flexDirection: "row",
            position: "relative",
            height: "100%",
            border: "solid",
            width: relativeWidth,
            left: `calc(${diffFromStart} - ${previousScheduleBarWidth}`,
            backgroundColor: color,
            whiteSpace: "nowrap",
            overflow: "clip",
            cursor: "default",
            userSelect: "none"
        });
        scheduleBar.className = "card";

        const departureReturnInfoDiv: HTMLDivElement = this.departureReturnInfoDiv();
        const reservationNameDiv: HTMLDivElement = this.reservationNameDiv();

        scheduleBar.append(departureReturnInfoDiv, reservationNameDiv);

        scheduleBar.addEventListener("click", (event: MouseEvent) => {
            const modalBackgroundDiv: HTMLDivElement = this.modalBackgroundDiv();
            const reservationInfoModal: HTMLDivElement = this.reservationInfoModalDiv(event);

            modalBackgroundDiv.append(reservationInfoModal);
            body.append(modalBackgroundDiv);

            this.modalBackground = modalBackgroundDiv;
        }, false);

        window.addEventListener("click", (event: MouseEvent) => {
            if (event.target === this.modalBackground) {
                this.modalBackground.remove();
            }
        }, false);

        scheduleBar.addEventListener("contextmenu", async () => {
            await window.contextMenu.scheduleBar({ reservationId: reservationData.id });
        }, false);

        const scheduleBarInfo = {
            divElement: scheduleBar,
            reservationData: reservationData,
            instance: this
        }

        ScheduleBar.scheduleBars.push(scheduleBarInfo);

        this.scheduleBar = scheduleBar;
    }

    private modalBackgroundDiv = (): HTMLDivElement => {
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

    private departureReturnInfoDiv = () => {
        const DepartureTimeDiv = () => {
            const departureDatetime: Date = new Date(this.reservationData.departureDatetime);
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
            const departureStore: string = this.reservationData.departureStore;
            const departureStoreDiv: HTMLDivElement = document.createElement("div");
            Object.assign(departureStoreDiv.style, {
                gridRow: "1",
                gridColumn: "2"
            });
            departureStoreDiv.textContent = departureStore;
            return departureStoreDiv;
        }

        const ReturnTimeDiv = () => {
            const returnDatetime: Date = new Date(this.reservationData.returnDatetime);
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
            const returnStore: string = this.reservationData.returnStore;
            const returnStoreDiv: HTMLDivElement = document.createElement("div");
            Object.assign(returnStoreDiv.style, {
                gridRow: "2",
                gridColumn: "2"
            });
            returnStoreDiv.textContent = returnStore;
            return returnStoreDiv;
        }

        const departureReturnInfoDiv: HTMLDivElement = document.createElement("div");
        Object.assign(departureReturnInfoDiv.style, {
            display: "grid",
            height: "100%",
            width: "100px"
        });
        const departureTimeDiv: HTMLDivElement = DepartureTimeDiv();
        const departureStoreDiv: HTMLDivElement = DepartureStoreDiv();
        const returnTimeDiv: HTMLDivElement = ReturnTimeDiv();
        const returnStoreDiv: HTMLDivElement = ReturnStoreDiv();

        departureReturnInfoDiv.append(departureTimeDiv, departureStoreDiv, returnTimeDiv, returnStoreDiv);
        return departureReturnInfoDiv;
    }

    private reservationNameDiv = () => {
        const reservationName = `${this.reservationData.reservationName} 様`;
        const reservationNameDiv: HTMLDivElement = document.createElement("div");
        Object.assign(reservationNameDiv.style, {
            padding: "1em"
        });
        reservationNameDiv.textContent = reservationName;
        return reservationNameDiv;
    }

    reservationInfoModalDiv = (mouseEvent: MouseEvent): HTMLDivElement => {
        const ReservationInfoModal = (): HTMLDivElement => {
            const reservationInfoModal: HTMLDivElement = document.createElement("div");
            Object.assign(reservationInfoModal.style, {
                display: "grid",
                zIndex: "2",
                backgroundColor: "green",
                position: "absolute",
                left: `${mouseEvent.x}px`,
                top: `${mouseEvent.y}px`,
                border: "solid"
            });
            reservationInfoModal.className = "card"
            return reservationInfoModal;
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
            const departureMonth: string = getMonthName({ monthIndex: departureMonthIndex });
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
            const returnMonth: string = getMonthName({ monthIndex: returnMonthIndex });
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

export { ScheduleBar }