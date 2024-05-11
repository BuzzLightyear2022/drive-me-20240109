export class ScheduleCell extends HTMLElement {
    rentalCarId: string;

    constructor(args: { rentalCarItem: Element }) {
        super();

        const { rentalCarItem } = args;

        this.rentalCarId = rentalCarItem.getAttribute("data-rentalCar-id");
        this.setAttribute("data-rentalCar-id", this.rentalCarId);

        const rentalCarItemHeight: number = rentalCarItem.getBoundingClientRect().height;

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "column",
            minHeight: `${rentalCarItemHeight}px`,
            maxHeight: `${rentalCarItemHeight}px`,
            border: "solid",
            borderWidth: "1px",
            marginTop: "-1px",
            marginLeft: "-1px",
            whiteSpace: "nowrap",
            overflow: "visible"
        });

        this.addEventListener("contextmenu", this.contextmenuHandler, false);
    }

    contextmenuHandler = {
        handleEvent: (event: Event) => {
            window.contextmenu.scheduleCell({ rentalCarId: this.rentalCarId });
        }
    }
}

customElements.define("schedule-cell", ScheduleCell);