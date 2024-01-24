import { getMonthName } from "../common_modules.mjs"
import { ScheduleContainerType } from "./schedule_container.mjs";

export type DaysContainerType = InstanceType<typeof DaysContainer>;

export type Calendar = {
    daysContainer: DaysContainerType,
    scheduleContainer: ScheduleContainerType
}

export const DaysContainer = class {
    static calendars: Calendar[] = [];

    calendar: Calendar = {
        daysContainer: undefined,
        scheduleContainer: undefined
    }

    daysContainer: HTMLDivElement;
    dateObject: Date;

    constructor(dateObject: Date) {
        this.dateObject = dateObject;
        this.calendar.daysContainer = this;
        DaysContainer.calendars.push(this.calendar);
    }

    createDaysContainer = () => {
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
        const calendarDays: number = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();

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

            dayCell.textContent = i === 1 ? `${getMonthName(calendarMonthIndex)}/${i}` : `${i}`;

            if (calendarYear === currentDate.getFullYear() && calendarMonthIndex === currentDate.getMonth() && i === currentDate.getDate()) {
                Object.assign(dayCell.style, {
                    background: "linear-gradient(0deg, rgba(39, 98, 238, 0.49) 68%, rgba(61, 112, 222, 1) 90%"
                });
            }

            this.daysContainer.append(dayCell);
        }
    }
}