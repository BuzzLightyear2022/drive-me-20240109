export class ScheduleCell extends HTMLElement {
    rentalCarId: string;

    constructor(args: { rentalCarItem: Element }) {
        super();

        const { rentalCarItem } = args;

        this.rentalCarId = rentalCarItem.getAttribute("data-vehicle-id");
        this.setAttribute("data-vehicle-id", this.rentalCarId);

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

        this.addEventListener("contextmenu", this.contextmenuHandler, false);
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

    contextmenuHandler = {
        handleEvent: (event: Event) => {
            window.contextmenu.scheduleCell(Number(this.rentalCarId));
        }
    }
}

customElements.define("schedule-cell", ScheduleCell);