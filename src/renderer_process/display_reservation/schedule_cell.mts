import { VehicleItemType } from "./vehicle_item.mjs";
import { DaysContainerType } from "./days_container.mjs";

export type ScheduleCellType = InstanceType<typeof ScheduleCell>;

export const ScheduleCell = class {
    static instances: ScheduleCellType[] = [];

    scheduleCell: HTMLDivElement;
    scheduleDivs: {
        reservationScheduleDiv: HTMLDivElement,
        maintenanceScheduleDiv: HTMLDivElement
    }

    vehicleItem: VehicleItemType;
    daysContainer: DaysContainerType;

    width: number;
    height: number;

    constructor(args: {
        width: number,
        height: number
    }) {
        const { width, height } = args;

        this.width = width;
        this.height = height;

        ScheduleCell.instances.push(this);
    }

    createScheduleCell = (): void => {
        this.scheduleCell = document.createElement("div");
        Object.assign(this.scheduleCell.style, {
            display: "flex",
            flexDirection: "column",
            width: `${this.width}px`,
            minHeight: `${this.height}px`,
            border: "solid",
            borderWidth: "1px 0.5px",
            marginTop: "-1px",
            whiteSpace: "nowrap",
            overflow: "visible"
        });

        const InnerScheduleDiv = (): HTMLDivElement => {
            const innerScheduleDiv: HTMLDivElement = document.createElement("div");
            Object.assign(innerScheduleDiv.style, {
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "50%"
            });

            return innerScheduleDiv;
        }

        const scheduleDiv: HTMLDivElement = InnerScheduleDiv();
        const maintenanceDiv: HTMLDivElement = InnerScheduleDiv();

        this.scheduleCell.append(scheduleDiv, maintenanceDiv);
    }
}