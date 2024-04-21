import { Reservation } from "../../@types/types";
import { ScheduleCell, ScheduleCellType } from "./schedule_cell.mjs";
import { ScheduleBar, ScheduleBarType } from "./schedule_bar.mjs";

export class Schedule extends HTMLElement {
    constructor() {
        super();



        Object.assign(this.style, {
            display: "flex",
            flexDirection: "column",
            // minWidth: `${daysContainerWidth}px`,
            whiteSpace: "nowrap"
        });
    }
}

customElements.define("schedule-container", Schedule);