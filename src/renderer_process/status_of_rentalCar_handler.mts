import { loadImage } from "./common_modules.mjs";
import { CarLocation, RentalCarStatus, RentalCar, LicensePlate } from "../@types/types";

const licensePlatePlace = document.querySelector("#license-plate-place");
const rentalCarImageDiv = document.querySelector("#rentalCar-image-div");
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
    const rentalCarId: string = await window.contextmenu.getRentalCarId();

    const rentalCar: RentalCar = await window.sqlSelect.rentalCarById({ rentalCarId: rentalCarId });

    const licensePlateString = `${rentalCar.licensePlateRegion} ${rentalCar.licensePlateCode} ${rentalCar.licensePlateHiragana} ${rentalCar.licensePlateNumber}`;
    licensePlatePlace.textContent = licensePlateString;

    const imgElm = await loadImage({
        fileName: rentalCar.imageFileName,
        width: "300px",
        height: "300px"
    });
    rentalCarImageDiv.append(imgElm);

    submitButton.addEventListener("click", async () => {
        const rentalCarStatus: RentalCarStatus = {
            rentalCarId: rentalCarId,
            currentLocation: currentLocationSelect.value,
            washState: washStateSelect.value,
            comment: commentTextarea.value,
            createdAt: null,
            updatedAt: null
        }

        await window.sqlInsert.rentalCarStatus({ rentalCarStatus: rentalCarStatus });
    }, false);
})();