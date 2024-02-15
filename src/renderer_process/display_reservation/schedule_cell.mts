import { VehicleItemType } from "./vehicle_item.mjs";
import { DaysContainerType } from "./days_container.mjs";

export type ScheduleCellType = InstanceType<typeof ScheduleCell>;

export const ScheduleCell = class {
    static instances: ScheduleCellType[] = [];

    scheduleCell: HTMLDivElement;
    scheduleDivs: {
        reservationScheduleDiv: HTMLDivElement | undefined,
        maintenanceScheduleDiv: HTMLDivElement | undefined
    } = {
            reservationScheduleDiv: undefined,
            maintenanceScheduleDiv: undefined
        }

    vehicleItem: VehicleItemType;
    daysContainer: DaysContainerType;

    width: string;
    height: string;

    constructor(vehicleItem: VehicleItemType) {
        this.vehicleItem = vehicleItem

        ScheduleCell.instances.push(this);
    }

    createScheduleCell = (): void => {
        const daysContainerElm: HTMLDivElement = this.daysContainer.daysContainer;
        const daysContainerWidth: number = daysContainerElm.getBoundingClientRect().width;

        const vehicleItemElm: HTMLDivElement = this.vehicleItem.vehicleItem;
        const vehicleItemHeight: number = vehicleItemElm.getBoundingClientRect().height;
        console.log(vehicleItemHeight);

        this.scheduleCell = document.createElement("div");
        Object.assign(this.scheduleCell.style, {
            display: "flex",
            flexDirection: "column",
            minWidth: `${daysContainerWidth}px`,
            minHeight: `${vehicleItemHeight}px`,
            border: "solid",
            borderWidth: "1px",
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

        this.scheduleDivs.reservationScheduleDiv = InnerScheduleDiv();
        this.scheduleDivs.maintenanceScheduleDiv = InnerScheduleDiv();

        this.scheduleCell.append(this.scheduleDivs.reservationScheduleDiv, this.scheduleDivs.maintenanceScheduleDiv);
    }

    handleWindowResize = (args: {
        width: string,
        height: string
    }): void => {
        const { width, height } = args;

        this.width = width;
        this.height = height;

        this.scheduleCell.style.minWidth = this.width;
        this.scheduleCell.style.minHeight = this.height;
    }
}