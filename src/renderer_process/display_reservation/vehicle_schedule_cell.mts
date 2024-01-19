import { VehicleAttributes } from "../../@types/types"

export type VehicleScheduleCellType = InstanceType<typeof VehicleScheduleCell>;

export const VehicleScheduleCell = class {
    vehicleScheduleCellInfo: {
        vehicleId: string,
        vehicleScheduleCell: HTMLDivElement
        reservationScheduleDiv: HTMLDivElement
        maintenanceScheduleDiv: HTMLDivElement
    }

    constructor(args: {
        vehicleAttributes: VehicleAttributes,
        vehicleCalendarWidth: number
    }) {
        const {
            vehicleAttributes,
            vehicleCalendarWidth
        } = args;

        const vehicleScheduleCell: HTMLDivElement = document.createElement("div");
        Object.assign(vehicleScheduleCell.style, {
            display: "flex",
            flexDirection: "column",
            whiteSpace: "nowrap",
            overflow: "visible",
            minHeight: "130px",
            width: `${vehicleCalendarWidth}px`,
            border: "solid",
            borderWidth: "1px 0.5px",
            marginTop: "-1px"
        });

        const reservationScheduleDiv: HTMLDivElement = this.scheduleDiv();
        const maintenanceScheduleDiv: HTMLDivElement = this.scheduleDiv();

        this.vehicleScheduleCellInfo.vehicleId = vehicleAttributes.id;
        this.vehicleScheduleCellInfo.vehicleScheduleCell = vehicleScheduleCell;
        this.vehicleScheduleCellInfo.reservationScheduleDiv = reservationScheduleDiv;
        this.vehicleScheduleCellInfo.maintenanceScheduleDiv = maintenanceScheduleDiv;

        vehicleScheduleCell.append(reservationScheduleDiv, maintenanceScheduleDiv);

        return this;
    }

    scheduleDiv = (): HTMLDivElement => {
        const scheduleDiv: HTMLDivElement = document.createElement("div");

        Object.assign(scheduleDiv.style, {
            display: "flex",
            flexDirection: "row",
            height: "50%",
        });

        return scheduleDiv;
    }
}