import { VehicleItem } from "./vehicle_item.mjs";
import { DaysContainer, DaysContainerType } from "./days_container.mjs";
import { ScheduleCell, ScheduleCellType } from "./schedule_cell.mjs";

export type ScheduleContainerType = InstanceType<typeof ScheduleContainer>;

export const ScheduleContainer = class {
    scheduleContainer: HTMLDivElement;
    daysContainer: DaysContainerType;

    constructor(daysContainer: DaysContainerType) {
        this.daysContainer = daysContainer;
        // @ts-ignore
        daysContainer.calendar.scheduleContainer = this;
    }

    createScheduleContainer = () => {
        this.scheduleContainer = document.createElement("div");
        Object.assign(this.scheduleContainer.style, {
            display: "flex",
            flexDirection: "column",
            flexBasis: "content",
            whiteSpace: "nowrap"
        });

        VehicleItem.instances.forEach(instance => {
            const daysContainer: HTMLDivElement = this.daysContainer.daysContainer;
            const daysContainerWidth: number = daysContainer.getBoundingClientRect().width;

            const vehicleItem: HTMLDivElement = instance.vehicleItem;
            const vehicleItemHeight: number = vehicleItem.getBoundingClientRect().height;

            const scheduleCellInstance: ScheduleCellType = new ScheduleCell({
                width: daysContainerWidth,
                height: vehicleItemHeight
            });
            scheduleCellInstance.createScheduleCell();

            const scheduleCell: HTMLDivElement = scheduleCellInstance.scheduleCell;

            this.scheduleContainer.append(scheduleCell);
        });
    }
}