import { getMonthName, getDayName } from "../common_modules.mjs"
import { ScheduleContainerType } from "./schedule_container.mjs";

const windowContainer: HTMLDivElement = document.querySelector("#window-container");
const tableHeader: HTMLDivElement = document.querySelector("#table-header");
const monthDisplay: HTMLDivElement = document.querySelector("#month-display");

export type DaysContainerType = InstanceType<typeof DaysContainer>;

export type Calendar = {
    daysContainer: DaysContainerType,
    scheduleContainer: ScheduleContainerType,
    intersectionObserver: IntersectionObserver
}

export const DaysContainer = class {
    static calendars: Calendar[] = [];
    static previousMonthDiff: number = 1;
    static nextMonthDiff: number = 3;

    calendar: Calendar = {
        daysContainer: this,
        scheduleContainer: undefined,
        intersectionObserver: undefined
    }

    daysContainer: HTMLDivElement;
    dateObject: Date;

    constructor(dateObject: Date, append: boolean = true) {
        this.dateObject = dateObject;

        if (append) {
            DaysContainer.calendars.unshift(this.calendar);
        } else {
            DaysContainer.calendars.push(this.calendar);
        }
    }

    createDaysContainer = async (): Promise<void> => {
        this.daysContainer = document.createElement("div");
        Object.assign(this.daysContainer.style, {
            display: "flex",
            flexDirection: "row",
            flexBasis: "auto",
            flexGrow: 1,
            flexShrink: 1,
            whiteSpace: "nowrap",
            overflow: "visible",
        });

        const currentDate: Date = new Date();

        const calendarYear: number = this.dateObject.getFullYear();
        const calendarMonthIndex: number = this.dateObject.getMonth();
        const month: string = getMonthName(calendarMonthIndex);
        const calendarDays: number = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
        let holidays;

        try {
            const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
            const jsonResponse = await response.json();
            const dates = Object.keys(jsonResponse);
            holidays = dates;
        } catch (error) {
            console.error(error);
        }

        for (let i = 1; i <= calendarDays; i++) {
            const thisDate = new Date(this.dateObject.getFullYear(), this.dateObject.getMonth(), i, 9);

            const dayCell: HTMLDivElement = document.createElement("div");
            Object.assign(dayCell.style, {
                display: "flex",
                justifyContent: "center",
                minWidth: "120px",
                height: "50px",
                lineHeight: "200%",
                fontSize: "150%",
                border: "solid",
                borderWidth: "1px 0.5px"
            });

            const dayIndex: number = new Date(calendarYear, calendarMonthIndex, i).getDay();
            const day: string = getDayName(dayIndex);

            dayCell.textContent = i === 1 ? `${month}/${i}(${day})` : `${i}(${day})`;

            if (dayIndex === 0) {
                dayCell.style.background = "#ff0033";
            } else if (dayIndex === 6) {
                dayCell.style.background = "#0582ff";
            }

            holidays.forEach(holiday => {
                const thisDateMs: number = thisDate.getTime();
                const holidayDate = new Date(holiday).getTime();

                if (thisDateMs === holidayDate) {
                    dayCell.style.color = "black"
                    dayCell.style.background = "radial-gradient(circle closest-corner, rgba(255, 0, 0, 1) 25%, rgba(255, 255, 255, 1) 20%)";
                }
            });

            if (currentDate.getFullYear() === this.dateObject.getFullYear() && currentDate.getMonth() === this.dateObject.getMonth() && currentDate.getDate() === thisDate.getDate()) {
                dayCell.style.borderColor = "yellow";
                dayCell.style.borderWidth = "10px";
                dayCell.style.lineHeight = "calc(200% - 20px)";
            }

            this.daysContainer.append(dayCell);
        }
        await new Promise(resolve => setTimeout(resolve, 0));

        this.monthDisplayHandler();
    }

    monthDisplayHandler = () => {
        const getWindowContainerPaddingLeft = (): number => {
            const tableHeaderWidth: number = tableHeader.getBoundingClientRect().width;
            const windowContainerStyle = window.getComputedStyle(windowContainer);
            const windowContainerPaddingLeft: number = Number(windowContainerStyle.paddingLeft.slice(0, -2));
            const offsetLeft: number = tableHeaderWidth + windowContainerPaddingLeft;

            return offsetLeft;
        }

        const getDateString = (date: Date): string => {
            const year: number = date.getFullYear();
            const monthIndex: number = date.getMonth();
            const month: string = getMonthName(monthIndex);
            const dateString = `${year}年${month}月`;
            return dateString;
        }

        const intersectionObserver: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                const epsilon: number = 1;

                const windowContainerPaddingLeft: number = getWindowContainerPaddingLeft();
                const leftScrollDiff: number = Math.abs(entry.intersectionRect.left - windowContainerPaddingLeft);

                if (entry.isIntersecting && leftScrollDiff < epsilon) {
                    const date: Date = this.dateObject;
                    const dateString: string = getDateString(this.dateObject);
                    monthDisplay.textContent = dateString;
                    monthDisplay.animate([
                        { transform: "translateX(200px)" },
                        { transform: "translateX(0px)" }
                    ],
                        {
                            duration: 300
                        }
                    )
                } else if (!entry.isIntersecting && entry.boundingClientRect.left < 0) {
                    const date: Date = this.dateObject;
                    const nextMonthDate: Date = new Date(date.getFullYear(), date.getMonth() + 1);
                    const dateString: string = getDateString(nextMonthDate);
                    monthDisplay.textContent = dateString;
                    monthDisplay.animate([
                        { transform: "translateX(-200px)" },
                        { transform: "translateX(0px)" }
                    ],
                        {
                            duration: 300
                        }
                    );
                }
            });
        });

        intersectionObserver.observe(this.daysContainer);
    }
}