export class ScheduleCell extends HTMLElement {
    constructor(args: { rentalCarItem: Element }) {
        super();

        const { rentalCarItem } = args;

        const rentalCarItemId: string = rentalCarItem.getAttribute("data-vehicle-id");
        this.setAttribute("data-vehicle-id", rentalCarItemId);

        const rentalCarItemHeight: number = rentalCarItem.getBoundingClientRect().height;

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "column",
            minHeight: `${rentalCarItemHeight}px`,
            border: "solid",
            borderWidth: "1px",
            marginTop: "-1px",
            marginLeft: "-1px",
            whiteSpace: "nowrap",
            overflow: "visible"
        });

        this.appendInnerScheduleCells();
    }

    appendInnerScheduleCells = (): void => {
        const innerScheduleCellStyle = {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "50%"
        }

        const rentalScheduleCell: HTMLDivElement = document.createElement("div");
        Object.assign(rentalScheduleCell.style, innerScheduleCellStyle);
        rentalScheduleCell.setAttribute("schedule-category", "rental");

        const maintenanceScheduleCell: HTMLDivElement = document.createElement("div");
        Object.assign(maintenanceScheduleCell.style, innerScheduleCellStyle);
        maintenanceScheduleCell.setAttribute("schedule-category", "maintenance");

        this.append(rentalScheduleCell, maintenanceScheduleCell);
    }
}

customElements.define("schedule-cell", ScheduleCell);