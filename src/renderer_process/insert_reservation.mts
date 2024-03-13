import { appendOptions, setRadioValue } from "./common_modules.mjs";
import { VehicleAttributes, ReservationData, LicensePlatesData } from "../@types/types";
import { getRadioValue } from "./common_modules.mjs";

const reservationName: HTMLInputElement = document.querySelector("#reservation-name") as HTMLInputElement;
const rentalCategoryRadios: NodeListOf<HTMLInputElement> = document.getElementsByName("rental-category") as NodeListOf<HTMLInputElement>;
const departureStore: HTMLSelectElement = document.querySelector("#departure-store") as HTMLSelectElement;
const returnStore: HTMLSelectElement = document.querySelector("#return-store") as HTMLSelectElement;
const departureDatetime: HTMLInputElement = document.querySelector("#departure-datetime") as HTMLInputElement;
const returnDatetime: HTMLInputElement = document.querySelector("#return-datetime") as HTMLInputElement;
const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class-select") as HTMLSelectElement;
const nonSmokingRadios: NodeListOf<HTMLInputElement> = document.getElementsByName("non-smoking") as NodeListOf<HTMLInputElement>;
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model") as HTMLSelectElement;
const licensePlateSelect: HTMLSelectElement = document.querySelector("#license-plate") as HTMLSelectElement;
const commentTextarea: HTMLTextAreaElement = document.querySelector("#comment-textarea") as HTMLTextAreaElement;

const submitButton: HTMLButtonElement = document.querySelector("#submit-button") as HTMLButtonElement;

(async () => {
    const vehicleId: number = await window.contextmenu.getVehicleId();

    if (vehicleId) {
        const vehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: vehicleId });

        if (vehicleAttributes.nonSmoking) {
            setRadioValue({ radios: nonSmokingRadios, checkedValue: "non-smoking" });
        } else {
            setRadioValue({ radios: nonSmokingRadios, checkedValue: "ok-smoking" });
        }

        const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-specification" });
        const rentalClasses: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: selectedSmoking });
        appendOptions({ selectbox: rentalClassSelect, options: rentalClasses });
        rentalClassSelect.value = vehicleAttributes.rentalClass;

        const selectedRentalClass: string = rentalClassSelect.value;
        const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });
        appendOptions({ selectbox: carModelSelect, options: carModels });
        carModelSelect.value = vehicleAttributes.carModel;

        const selectedCarModel: string = carModelSelect.value;
        const licensePlateData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });

        while (licensePlateSelect.firstChild) {
            licensePlateSelect.removeChild(licensePlateSelect.firstChild);
        }

        licensePlateData.map((licensePlateData: { id: number, licensePlate: string }) => {
            const option = document.createElement("option");
            option.textContent = licensePlateData.licensePlate;
            option.value = String(licensePlateData.id);
            licensePlateSelect.append(option);
        });

        licensePlateSelect.value = String(vehicleId);
    } else {
        const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });

        const rentalClasses: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: selectedSmoking });
        appendOptions({ selectbox: rentalClassSelect, options: rentalClasses });

        const selectedRentalClass: string = rentalClassSelect.value;
        const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });

        appendOptions({ selectbox: carModelSelect, options: carModels });

        const selectedCarModel: string = carModelSelect.value;
        const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
        const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
            return licensePlateData.licensePlate;
        });
        const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
            return licensePlateData.id;
        });

        appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
    }
})();

nonSmokingRadios.forEach((nonSmokingRadio: HTMLInputElement) => {
    nonSmokingRadio.addEventListener("change", async () => {
        const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });

        const rentalClasses: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: selectedSmoking });

        appendOptions({ selectbox: rentalClassSelect, options: rentalClasses });

        const selectedRentalClass: string = rentalClassSelect.value;
        const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });

        appendOptions({ selectbox: carModelSelect, options: carModels });

        const selectedCarModel: string = carModelSelect.value;
        const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
        const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
            return licensePlateData.licensePlate;
        });
        const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
            return licensePlateData.id;
        });

        appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
    }, false);
});

rentalClassSelect.addEventListener("change", async () => {
    const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });

    const selectedRentalClass: string = rentalClassSelect.value;
    const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });

    appendOptions({ selectbox: carModelSelect, options: carModels });

    const selectedCarModel: string = carModelSelect.value;
    const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
    const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
        return licensePlateData.licensePlate;
    });
    const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
        return licensePlateData.id;
    });

    appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
}, false);

carModelSelect.addEventListener("change", async () => {
    const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });
    const selectedCarModel: string = carModelSelect.value;
    const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
    const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
        return licensePlateData.licensePlate;
    });
    const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
        return licensePlateData.id;
    });

    appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
}, false);

(async () => {
    submitButton.addEventListener("click", async () => {
        const selectedRentalCategory: string = getRadioValue({ radios: rentalCategoryRadios, defaultValue: "general-rental" });
        const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-specification" });
        const selectedDepartureDatetime: Date = new Date(departureDatetime.value);
        const selectedReturnDatetime: Date = new Date(returnDatetime.value);

        const reservationData: ReservationData = {
            vehicleId: Number(licensePlateSelect.value),
            reservationName: reservationName.value,
            rentalCategory: selectedRentalCategory,
            pickupLocation: departureStore.value,
            returnLocation: returnStore.value,
            pickupDateObject: selectedDepartureDatetime,
            returnDateObject: selectedReturnDatetime,
            nonSmoking: selectedSmoking,
            comment: commentTextarea.value,
            isCanceled: false
        }

        try {
            await window.sqlInsert.reservationData(reservationData);
        } catch (error: unknown) {
            console.error(`Failed to invoke reservationData: ${error}`);
        }
    }, false);
})();