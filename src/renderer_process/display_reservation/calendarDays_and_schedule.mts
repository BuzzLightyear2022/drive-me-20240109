import { CalendarDays } from "./calendar_days.mjs";
import { Schedule } from "./schedule.mjs";

export class CalendarDaysAndSchedule {
    calendarDays: HTMLElement = undefined;
    schedule: HTMLElement = undefined;

    constructor(args: { dateObject: Date }) {
        const { dateObject } = args;

        this.calendarDays = new CalendarDays({ dateObject: dateObject });

        const customElement = document.querySelector(`[data-dateObject="${dateObject}"]`);
        console.log(customElement);

        this.schedule = new Schedule();
    }
}