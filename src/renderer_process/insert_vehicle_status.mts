import { loadImage } from "./common_modules.mjs";
import { CarLocation, VehicleAttributes } from "../@types/types";

const licensePlatePlace = document.querySelector("#license-plate-place");
const vehicleImageDiv = document.querySelector("#vehicle-image-div");
const parkingLocationSelect = document.querySelector("#parking-location-select");

(async () => {
    const response: CarLocation = await window.fetchJson.carLocation();
    const carLocation: string[] = response.location;

    carLocation.forEach((location: string) => {
        const option = document.createElement("option");
        option.textContent = location;
        parkingLocationSelect.append(option);
    });
})();

(async () => {
    const vehicleId: number = await window.contextmenu.getVehicleId();
    const vehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: vehicleId });

    const licensePlate: string = `${vehicleAttributes.licensePlateRegion} ${vehicleAttributes.licensePlateCode} ${vehicleAttributes.licensePlateHiragana} ${vehicleAttributes.licensePlateNumber}`;
    licensePlatePlace.textContent = licensePlate;

    const imgElm = await loadImage({
        fileName: vehicleAttributes.imageFileName,
        width: 300,
        height: 300
    });
    vehicleImageDiv.append(imgElm);
})();