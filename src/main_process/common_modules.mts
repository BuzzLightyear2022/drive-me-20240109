import { VehicleAttributes } from "../@types/types";

export const makeImageFileName = (vehicleAttributes: VehicleAttributes): string => {
    const carModel: string = vehicleAttributes.carModel;
    const licensePlateNumber: string = vehicleAttributes.licensePlateNumber;
    const modelCode: string = vehicleAttributes.modelCode;
    const timestamp: number = new Date().getTime();
    const imageFileName = `${carModel}${licensePlateNumber}${modelCode}${timestamp}.jpeg`;
    return imageFileName;
}