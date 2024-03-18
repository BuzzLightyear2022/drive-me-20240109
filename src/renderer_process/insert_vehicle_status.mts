import { loadImage } from "./common_modules.mjs";
import { CarLocation, VehicleAttributes, VehicleStatus } from "../@types/types";

const licensePlatePlace = document.querySelector("#license-plate-place");
const vehicleImageDiv = document.querySelector("#vehicle-image-div");
const currentLocationSelect: HTMLSelectElement = document.querySelector("#parking-location-select");
const washStateSelect: HTMLSelectElement = document.querySelector("#wash-state-select");
const commentTextarea: HTMLTextAreaElement = document.querySelector("#comment-textarea");
const submitButton = document.querySelector("#submit-button");

(async () => {
    const response: CarLocation = await window.fetchJson.carLocation();
    const carLocation: string[] = response.location;

    carLocation.forEach((location: string) => {
        const option = document.createElement("option");
        option.textContent = location;
        currentLocationSelect.append(option);
    });
})();

(async () => {
    const vehicleId: number = await window.contextmenu.getVehicleId();
    const vehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: vehicleId });

    const licensePlate: string = `${vehicleAttributes.licensePlateRegion} ${vehicleAttributes.licensePlateCode} ${vehicleAttributes.licensePlateHiragana} ${vehicleAttributes.licensePlateNumber}`;
    licensePlatePlace.textContent = licensePlate;

    const imgElm = await loadImage({
        fileName: vehicleAttributes.imageFileName,
        width: "400px",
        height: "400px"
    });
    vehicleImageDiv.append(imgElm);

    submitButton.addEventListener("click", async () => {
        const vehicleStatus: VehicleStatus = {
            vehicleId: vehicleId,
            currentLocation: currentLocationSelect.value,
            washState: washStateSelect.value,
            comment: commentTextarea.value,
            createdAt: null,
            updatedAt: null
        }

        await window.sqlInsert.vehicleStatus({ vehicleStatus: vehicleStatus });
    }, false);
})();