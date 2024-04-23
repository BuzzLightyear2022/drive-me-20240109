import { getDayString } from "../common_modules.mjs";

export class CalendarDate extends HTMLElement {
    constructor(args: { dateObject: Date }) {
        super();

        const { dateObject } = args;

        const calendarYear: number = dateObject.getFullYear();
        const calendarMonthIndex: number = dateObject.getMonth();
        const calendarDays: number = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();

        const calendarStartTimestamp: string = String(new Date(calendarYear, calendarMonthIndex, 1, 0, 0, 0, 0).getTime());
        const calendarEndTimestamp: string = String(new Date(calendarYear, calendarMonthIndex + 1, 0, 23, 59, 59, 999).getTime());

        this.setAttribute("calendar-start-timestamp", calendarStartTimestamp);
        this.setAttribute("calendar-end-timestamp", calendarEndTimestamp);

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "row",
            flexBasis: "auto",
            flexGrow: 1,
            flexShrink: 1,
            whiteSpace: "nowrap",
            overflow: "visible"
        });

        (async () => {
            const holidays: string[] | undefined = await this.getHolidays();

            for (let date = 1; date <= calendarDays; date++) {
                const dateCell: HTMLDivElement = document.createElement("div");
                Object.assign(dateCell.style, {
                    display: "flex",
                    justifyContent: "center",
                    minWidth: "120px",
                    height: "50px",
                    lineHeight: "200%",
                    fontSize: "150%",
                    border: "solid",
                    marginLeft: "-1px",
                    borderWidth: "1px",
                    cursor: "default",
                    userSelect: "none"
                });

                const dayIndex: number = new Date(calendarYear, calendarMonthIndex, date).getDay();
                const dayString: string = getDayString({ dayIndex: dayIndex });

                dateCell.textContent = date === 1 ? `${calendarMonthIndex + 1}/${date}(${dayString})` : `${date}(${dayString})`;

                this.append(dateCell);
            }
        })();
    }

    getHolidays = async (): Promise<string[] | undefined> => {
        try {
            const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
            const jsonResponse = await response.json();
            return Object.keys(jsonResponse);
        } catch (error) {
            console.error(`Failed to fetch holidays: ${error}`);
            return undefined;
        }
    }

    // createDaysContainer = async (): Promise<void> => {
    //     this.daysContainer = document.createElement("div");
    //     Object.assign(this.daysContainer.style, {
    //         display: "flex",
    //         flexDirection: "row",
    //         flexBasis: "auto",
    //         flexGrow: 1,
    //         flexShrink: 1,
    //         whiteSpace: "nowrap",
    //         overflow: "visible",
    //     });
    // this.daysContainer.className = "days-container";

    // const currentDate: Date = new Date();

    // const calendarYear: number = this.dateObject.getFullYear();
    // const calendarMonthIndex: number = this.dateObject.getMonth();
    // const month: string = getMonthName(calendarMonthIndex);
    // const calendarDays: number = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
    // let holidays;

    // try {
    //     const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    //     const jsonResponse = await response.json();
    //     const dates = Object.keys(jsonResponse);
    //     holidays = dates;
    // } catch (error) {
    //     console.error(error);
    // }

    // for(let i = 1; i <= calendarDays; i++) {
    // const thisDate = new Date(this.dateObject.getFullYear(), this.dateObject.getMonth(), i, 9);

    // const dayCell: HTMLDivElement = document.createElement("div");
    // Object.assign(dayCell.style, {
    //     display: "flex",
    //     justifyContent: "center",
    //     minWidth: "120px",
    //     height: "50px",
    //     lineHeight: "200%",
    //     fontSize: "150%",
    //     border: "solid",
    //     borderWidth: "1px 0.5px",
    //     cursor: "default",
    //     userSelect: "none"
    // });

    // const dayIndex: number = new Date(calendarYear, calendarMonthIndex, i).getDay();
    // const day: string = getDayName(dayIndex);

    // dayCell.textContent = i === 1 ? `${month}/${i}(${day})` : `${i}(${day})`;

    // if (dayIndex === 0) {
    //     dayCell.style.background = "#ff0033";
    // } else if (dayIndex === 6) {
    //     dayCell.style.background = "#0582ff";
    // }

    // holidays.forEach(holiday => {
    //     const thisDateMs: number = thisDate.getTime();
    //     const holidayDate = new Date(holiday).getTime();

    //     if (thisDateMs === holidayDate) {
    //         dayCell.style.color = "black"
    //         dayCell.style.background = "radial-gradient(circle closest-corner, rgba(255, 0, 0, 1) 25%, rgba(255, 255, 255, 1) 20%)";
    //     }
    // });

    //     if (currentDate.getFullYear() === this.dateObject.getFullYear() && currentDate.getMonth() === this.dateObject.getMonth() && currentDate.getDate() === thisDate.getDate()) {
    //         dayCell.style.borderColor = "yellow";
    //         dayCell.style.borderWidth = "10px";
    //         dayCell.style.lineHeight = "calc(200% - 20px)";
    //     }

    //     this.daysContainer.append(dayCell);
    // }
    // await new Promise(resolve => setTimeout(resolve, 0));

    // this.monthDisplayHandler();
    //     }

    // monthDisplayHandler = () => {
    //     const getWindowContainerPaddingLeft = (): number => {
    //         const tableHeaderWidth: number = tableHeader.getBoundingClientRect().width;
    //         const windowContainerStyle = window.getComputedStyle(windowContainer);
    //         const windowContainerPaddingLeft: number = Number(windowContainerStyle.paddingLeft.slice(0, -2));
    //         const offsetLeft: number = tableHeaderWidth + windowContainerPaddingLeft;

    //         return offsetLeft;
    //     }

    //     const getDateString = (date: Date): string => {
    //         const year: number = date.getFullYear();
    //         const monthIndex: number = date.getMonth();
    //         const month: string = getMonthName(monthIndex);
    //         const dateString = `${year}年${month}月`;
    //         return dateString;
    //     }

    //     const intersectionObserver: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    //         const animationHandler = (offsetPosition: number) => {
    //             monthDisplay.animate([
    //                 { transform: `translateX(${offsetPosition}px)` },
    //                 { transform: "translateX(0px)" }
    //             ],
    //                 {
    //                     duration: 300
    //                 }
    //             )
    //         }

    //         entries.forEach((entry: IntersectionObserverEntry) => {
    //             const firstElement: HTMLDivElement = DaysContainer.calendars[0].daysContainer.daysContainer;
    //             const secondElement: HTMLDivElement = DaysContainer.calendars[1].daysContainer.daysContainer;
    //             const thirdElement: HTMLDivElement = DaysContainer.calendars[2].daysContainer.daysContainer;

    //             if (entry.isIntersecting && entry.target === firstElement) {
    //                 DaysContainer.isFirstElementVisible = true;
    //             } else if (!entry.isIntersecting && entry.target === firstElement) {
    //                 DaysContainer.isFirstElementVisible = false;
    //             }

    //             if (entry.isIntersecting && entry.target === thirdElement) {
    //                 DaysContainer.isThirdElementVisible = true;
    //             } else if (!entry.isIntersecting && entry.target === thirdElement) {
    //                 DaysContainer.isThirdElementVisible = false;
    //             }

    //             if (entry.isIntersecting && entry.target === firstElement) {
    //                 const dateString: string = getDateString(this.dateObject);
    //                 monthDisplay.textContent = dateString;
    //                 animationHandler(200);
    //             } else if (!entry.isIntersecting && entry.target === firstElement) {
    //                 const nextMonthDate: Date = new Date(this.dateObject.getFullYear(), this.dateObject.getMonth() + 2, 0);
    //                 const dateString: string = getDateString(nextMonthDate);
    //                 monthDisplay.textContent = dateString;
    //                 animationHandler(-200);
    //             }

    //             if (entry.isIntersecting && entry.target === secondElement && !DaysContainer.isFirstElementVisible) {
    //                 const dateString: string = getDateString(this.dateObject);
    //                 monthDisplay.textContent = dateString;
    //                 animationHandler(200);
    //             } else if (!entry.isIntersecting && entry.target === secondElement && DaysContainer.isThirdElementVisible) {
    //                 const nextMonthDate: Date = new Date(this.dateObject.getFullYear(), this.dateObject.getMonth() + 2, 0);
    //                 const dateString: string = getDateString(nextMonthDate);
    //                 monthDisplay.textContent = dateString;
    //                 animationHandler(-200);
    //             }
    //         });
    //     });

    //     intersectionObserver.observe(this.daysContainer);
    // }
}

customElements.define("calendar-date", CalendarDate);