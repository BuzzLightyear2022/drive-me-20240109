import { VehicleAttributes } from "../../@types/types"

const VehicleScheduleCell = class {
    vehicleId: string;
    vehicleScheduleCell: HTMLDivElement;
    reservationScheduleDiv: HTMLDivElement;
    maintenanceScheduleDiv: HTMLDivElement;

    constructor(args: { vehicleAttributes: VehicleAttributes, vehicleCalendarWidth: string }) {
        const { vehicleAttributes, vehicleCalendarWidth } = args;

        const vehicleScheduleCell: HTMLDivElement = document.createElement("div");
        Object.assign(vehicleScheduleCell.style, {
            display: "flex",
            flexDirection: "column",
            whiteSpace: "nowrap",
            overflow: "visible",
            minHeight: "130px",
            width: vehicleCalendarWidth,
            border: "solid"
        });
        const reservationScheduleDiv: HTMLDivElement = this.createScheduleDiv();
        const maintenanceScheduleDiv: HTMLDivElement = this.createScheduleDiv();

        this.vehicleId = vehicleAttributes.id;
        this.vehicleScheduleCell = vehicleScheduleCell;
        this.reservationScheduleDiv = reservationScheduleDiv;
        this.maintenanceScheduleDiv = maintenanceScheduleDiv;

        vehicleScheduleCell.append(reservationScheduleDiv, maintenanceScheduleDiv);

        return this;
    }

    private createScheduleDiv = (): HTMLDivElement => {
        const reservationScheduleDiv: HTMLDivElement = document.createElement("div");
        Object.assign(reservationScheduleDiv.style, {
            display: "flex",
            flexDirection: "row",
            height: "50%",
        });
        return reservationScheduleDiv;
    }
}

export { VehicleScheduleCell }