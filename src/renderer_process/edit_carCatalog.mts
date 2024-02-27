import { CarCatalog } from "src/@types/types";

const rentalClassSelect: HTMLSelectElement = document.querySelector("#rentalClass-select");

(async () => {
    const currentCarCatalog: CarCatalog = await window.fetchJson.carCatalog();

    const currentRentalClasses: string[] = Object.keys(currentCarCatalog.rentalClass);

    currentRentalClasses.forEach((rentalClass: string) => {
        const option: HTMLOptionElement = document.createElement("option");
        option.textContent = rentalClass;
        rentalClassSelect.append(option);
    });
})();