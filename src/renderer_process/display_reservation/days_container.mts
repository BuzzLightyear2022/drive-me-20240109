import { getMonthName, getDayName } from "../common_modules.mjs"
import { ScheduleContainerType } from "./schedule_container.mjs";

export type DaysContainerType = InstanceType<typeof DaysContainer>;

export type Calendar = {
    daysContainer: DaysContainerType,
    scheduleContainer: ScheduleContainerType,
    intersectionObserver: IntersectionObserver;
}

export const DaysContainer = class {
    static calendars: Calendar[] = [];

    calendar: Calendar = {
        daysContainer: this,
        scheduleContainer: undefined,
        intersectionObserver: undefined
    }

    daysContainer: HTMLDivElement;
    dateObject: Date;

    constructor(dateObject: Date) {
        this.dateObject = dateObject;
        DaysContainer.calendars.push(this.calendar);
    }

    createDaysContainer = async () => {
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
                const thisDate = new Date(this.dateObject.getFullYear(), this.dateObject.getMonth(), i, 9).getTime();
                const holidayDate = new Date(holiday).getTime();

                if (thisDate === holidayDate) {
                    dayCell.style.color = "black"
                    dayCell.style.background = "radial-gradient(circle closest-corner, rgba(255, 0, 0, 1) 25%, rgba(255, 255, 255, 1) 20%)";
                }
            });

            this.daysContainer.append(dayCell);
        }
    }

    setIntersectionObserver = (
        callback: (entries?: IntersectionObserverEntry[], observer?: IntersectionObserver) => void,
        options?: {
            root?: Element,
            rootMargin?: string,
            threshold?: number
        }
    ) => {
        this.calendar.intersectionObserver = new IntersectionObserver(callback, options);
    }
}