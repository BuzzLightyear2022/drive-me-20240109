import { LicensePlate, ReservationData } from "../../@types/types";
import { asyncAppendOptionElements } from "../common_modules.mjs";

const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class");
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model");
const vehicleIdSelect: HTMLSelectElement = document.querySelector("#license-plate");

export const appendCarOptions = async (args: { existingReservationData?: ReservationData }) => {
    const { existingReservationData } = args;

    const rentalClassOptions: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: null });
    await asyncAppendOptionElements({ selectElement: rentalClassSelect, appendedOptionStrings: rentalClassOptions });

    if (existingReservationData) {
        rentalClassSelect.value = existingReservationData.selectedRentalClass;
    }

    const selectedRentalClass = rentalClassSelect.value;
    const carModelOptions: string[] = await window.sqlSelect.carModels({ selectedSmoking: "none-specification", selectedRentalClass: selectedRentalClass });
    await asyncAppendOptionElements({ selectElement: carModelSelect, appendedOptionStrings: carModelOptions });

    const selectedCarModel: string = carModelSelect.value;
    const licensePlates: LicensePlate[] = await window.sqlSelect.licensePlates({ selectedSmoking: "none-specification", selectedCarModel: selectedCarModel });
    await Promise.all(licensePlates.map(async (licensePlate: LicensePlate) => {
        const licensePlateOption: HTMLOptionElement = document.createElement("option");
        licensePlateOption.textContent = `${licensePlate.licensePlate} (${licensePlate.nonSmoking ? "禁煙" : "喫煙"
            })`;
        licensePlateOption.value = String(licensePlate.id);
        vehicleIdSelect.append(licensePlateOption);
    }));
}

export const updateCarOptions = () => {
    rentalClassSelect.addEventListener("change", async () => {
        while (carModelSelect.firstChild) {
            carModelSelect.removeChild(carModelSelect.firstChild);
        }

        while (vehicleIdSelect.firstChild) {
            vehicleIdSelect.removeChild(vehicleIdSelect.firstChild);
        }

        const selectedRentalClass: string = rentalClassSelect.value;
        const newCarModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: "none-specification", selectedRentalClass: selectedRentalClass });
        newCarModels.forEach((newCarModel: string) => {
            const newCarModelOption: HTMLOptionElement = document.createElement("option");
            newCarModelOption.textContent = newCarModel;
            newCarModelOption.value = newCarModel;
            carModelSelect.append(newCarModelOption);
        });

        const selectedCarModel: string = carModelSelect.value;
        const newLicensePlates: LicensePlate[] = await window.sqlSelect.licensePlates({ selectedSmoking: "none-specification", selectedCarModel: selectedCarModel });
        newLicensePlates.forEach((newLicensePlate: LicensePlate) => {
            const newVehicleIdOption: HTMLOptionElement = document.createElement("option");
            newVehicleIdOption.textContent = `${newLicensePlate.licensePlate} (${newLicensePlate.nonSmoking ? "禁煙" : "喫煙"
                })`;
            newVehicleIdOption.value = String(newLicensePlate.id);
            vehicleIdSelect.append(newVehicleIdOption);
        });
    }, false);

    carModelSelect.addEventListener("change", async () => {
        while (vehicleIdSelect.firstChild) {
            vehicleIdSelect.removeChild(vehicleIdSelect.firstChild);
        }

        const selectedCarModel: string = carModelSelect.value;
        const newVehicleIdArray: LicensePlate[] = await window.sqlSelect.licensePlates({ selectedSmoking: "none-specification", selectedCarModel: selectedCarModel });
        newVehicleIdArray.forEach((newVehicleId: LicensePlate) => {
            const newVehicleIdOption: HTMLOptionElement = document.createElement("option");
            newVehicleIdOption.textContent = `${newVehicleId.licensePlate} (${newVehicleId.nonSmoking ? "禁煙" : "喫煙"
                })`;
            newVehicleIdOption.value = String(newVehicleId.id);
            vehicleIdSelect.append(newVehicleIdOption);
        });
    }, false);
}