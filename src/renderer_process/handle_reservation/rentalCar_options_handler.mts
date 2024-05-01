import { RentalCar, LicensePlate } from "../../@types/types";

const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class");
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model");
const rentalCarIdSelect: HTMLSelectElement = document.querySelector("#rentalCar-id");

const rentalClassSelectHandler = {
    handleEvent: async () => {
        const rentalClasses: string[] = await window.sqlSelect.existingRentalClasses({});
        await Promise.all(rentalClasses.map((rentalClass: string) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.textContent = rentalClass;
            option.value = rentalClass;
            rentalClassSelect.append(option);
        }));

        await carModelSelectHandler.handleEvent();
        await rentalCarIdSelectHandler.handleEvent();
    }
}

const carModelSelectHandler = {
    handleEvent: async () => {
        while (carModelSelect.firstChild) {
            carModelSelect.removeChild(carModelSelect.firstChild);
        }

        const selectedRentalClass: string = rentalClassSelect.value;

        const carModels: string[] = await window.sqlSelect.carModels({ rentalClass: selectedRentalClass });

        await Promise.all(carModels.map((carModel: string) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.textContent = carModel;
            option.value = carModel;
            carModelSelect.append(option);
        }));

        await rentalCarIdSelectHandler.handleEvent();
    }
}

const rentalCarIdSelectHandler = {
    handleEvent: async () => {
        while (rentalCarIdSelect.firstChild) {
            rentalCarIdSelect.removeChild(rentalCarIdSelect.firstChild);
        }

        const selectedCarModel: string = carModelSelect.value;

        const licensePlates: LicensePlate[] = await window.sqlSelect.licensePlates({ carModel: selectedCarModel });
        await Promise.all(licensePlates.map((licensePlate: LicensePlate) => {
            const option: HTMLOptionElement = document.createElement("option");
            const nonSmokingString: string = licensePlate.nonSmoking ? "禁煙車" : "喫煙車";
            option.textContent = `${licensePlate.licensePlate}(${nonSmokingString})`;
            option.value = String(licensePlate.id);
            rentalCarIdSelect.append(option);
        }));
    }
}

export const rentalCarOptionsHandler = async (args: { rentalCarId?: string }) => {
    const { rentalCarId } = args;

    let selectedRentalCar: RentalCar = undefined;

    if (rentalCarId) {
        selectedRentalCar = await window.sqlSelect.rentalCarById({ rentalCarId: rentalCarId });
    }

    await rentalClassSelectHandler.handleEvent();

    if (selectedRentalCar) {
        rentalClassSelect.value = selectedRentalCar.rentalClass;
        await carModelSelectHandler.handleEvent();
        carModelSelect.value = selectedRentalCar.carModel;
        await rentalCarIdSelectHandler.handleEvent();
        rentalCarIdSelect.value = selectedRentalCar.id;
    }

    rentalClassSelect.addEventListener("change", carModelSelectHandler, false);
    carModelSelect.addEventListener("change", rentalCarIdSelectHandler, false);
}

