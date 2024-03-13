import { appendOptions } from "./common_modules.mjs";
import { ReservationData, LicensePlatesData, VehicleAttributes } from "../@types/types";
import { getRadioValue, setRadioValue } from "./common_modules.mjs";

const reservationName: HTMLInputElement = document.querySelector("#reservation-name");
const rentalCategoryRadios: NodeListOf<HTMLInputElement> = document.getElementsByName("rental-category") as NodeListOf<HTMLInputElement>;
const pickupLocationSelect: HTMLSelectElement = document.querySelector("#pickup-location");
const returnLocationSelect: HTMLSelectElement = document.querySelector("#return-location");
const pickupDatetimeInput: HTMLInputElement = document.querySelector("#pickup-datetime");
const returnDatetimeInput: HTMLInputElement = document.querySelector("#return-datetime");
const nonSmokingRadios: NodeListOf<HTMLInputElement> = document.getElementsByName("non-smoking") as NodeListOf<HTMLInputElement>;
const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class-select") as HTMLSelectElement;
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model") as HTMLSelectElement;
const licensePlateSelect: HTMLSelectElement = document.querySelector("#license-plate") as HTMLSelectElement;
const commentTextarea: HTMLTextAreaElement = document.querySelector("#comment-textarea") as HTMLTextAreaElement;

const submitButton: HTMLButtonElement = document.querySelector("#submit-button") as HTMLButtonElement;

const setRentalClassSelectValue = async () => {
    const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });

    const rentalClasses: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: selectedSmoking });

    appendOptions({ selectbox: rentalClassSelect, options: rentalClasses });
}

const setCarModelSelectValue = async () => {
    const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });

    const selectedRentalClass: string = rentalClassSelect.value;
    const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });

    appendOptions({ selectbox: carModelSelect, options: carModels });
}

const setLicensePlateSelectValue = async () => {
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
}

(async () => {
    const reservationId: number = await window.contextmenu.getReservationId();

    const reservationData: ReservationData = await window.sqlSelect.reservationDataById({ reservationId: reservationId });
    const vehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: reservationData.vehicleId });

    const pickupDateObject: Date = new Date(reservationData.pickupDateObject);
    pickupDateObject.setHours(pickupDateObject.getHours() + 9);
    const returnDateObject: Date = new Date(reservationData.returnDateObject);
    returnDateObject.setHours(returnDateObject.getHours() + 9);

    reservationName.value = reservationData.reservationName;
    setRadioValue({ radios: rentalCategoryRadios, checkedValue: reservationData.rentalCategory });
    pickupLocationSelect.value = reservationData.pickupLocation;
    returnLocationSelect.value = reservationData.returnLocation;
    pickupDatetimeInput.value = pickupDateObject.toISOString().slice(0, 16);
    returnDatetimeInput.value = returnDateObject.toISOString().slice(0, 16);
    setRadioValue({ radios: nonSmokingRadios, checkedValue: reservationData.nonSmoking });

    await setRentalClassSelectValue();
    rentalClassSelect.value = vehicleAttributes.rentalClass;
    await setCarModelSelectValue();
    carModelSelect.value = vehicleAttributes.carModel;
    await setLicensePlateSelectValue();
    licensePlateSelect.value = String(vehicleAttributes.id);

    commentTextarea.value = reservationData.comment;

    submitButton.addEventListener("click", async () => {
        const selectedRentalCategory: string = getRadioValue({ radios: rentalCategoryRadios, defaultValue: "general-rental" });
        const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-specification" });
        const selectedDepartureDatetime: Date = new Date(pickupDatetimeInput.value);
        const selectedReturnDatetime: Date = new Date(returnDatetimeInput.value);

        const postReservationData: ReservationData = {
            id: reservationData.id,
            vehicleId: Number(licensePlateSelect.value),
            reservationName: reservationName.value,
            rentalCategory: selectedRentalCategory,
            pickupLocation: pickupLocationSelect.value,
            returnLocation: returnLocationSelect.value,
            pickupDateObject: selectedDepartureDatetime,
            returnDateObject: selectedReturnDatetime,
            nonSmoking: selectedSmoking,
            comment: commentTextarea.value,
            isCanceled: false
        }

        try {
            await window.sqlUpdate.reservationData(postReservationData);
        } catch (error: unknown) {
            console.error(`Failed to invoke reservationData: ${error}`);
        }
    }, false);
})();

nonSmokingRadios.forEach((nonSmokingRadio: HTMLInputElement) => {
    nonSmokingRadio.addEventListener("change", async () => {
        await setRentalClassSelectValue();
        await setCarModelSelectValue();
        await setLicensePlateSelectValue();
    }, false);
});

rentalClassSelect.addEventListener("change", async () => {
    await setCarModelSelectValue();
    await setLicensePlateSelectValue();
}, false);

carModelSelect.addEventListener("change", async () => {
    await setLicensePlateSelectValue();
}, false);