import { appendOptions, setRadioValue, getRadioValue } from "./common_modules.mjs";
import { VehicleAttributes, ReservationData, LicensePlatesData } from "../@types/types";

const title = document.querySelector("#title");
const reservationInputForm = document.querySelector("#reservation-input-form");
const reservationName: HTMLInputElement = document.querySelector("#reservation-name") as HTMLInputElement;
const reservationNameLabel: HTMLLabelElement = document.querySelector("#reservation-name-label");
const rentalCategoryRadios: NodeListOf<HTMLInputElement> = document.getElementsByName("rental-category") as NodeListOf<HTMLInputElement>;
const pickupLocation: HTMLSelectElement = document.querySelector("#pickup-location");
const pickupLocationLabel: HTMLLabelElement = document.querySelector("#pickup-location-label");
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

rentalCategoryRadios.forEach((radio: HTMLInputElement) => {
    radio.addEventListener("change", () => {
        const selectedRentalCategory: string = getRadioValue({ radios: rentalCategoryRadios });
        if (selectedRentalCategory === "loanerRental") {
            const firstRow = document.createElement("div");
            firstRow.className = "row";
            const firstCol = document.createElement("div");
            firstCol.className = "col-md";
            const form = document.createElement("div");
            form.className = "form-floating p-1";
            firstRow.append(firstCol);
            firstCol.append(form);

            const receptionBranches = ["本店", "AP"];
            const receptionBranchSelect: HTMLSelectElement = document.createElement("select");
            receptionBranchSelect.id = "reception-branch-select";
            receptionBranchSelect.className = "form-select";
            receptionBranches.forEach((branch) => {
                const option = document.createElement("option");
                option.textContent = branch;
                receptionBranchSelect.append(option);
            });
            const label = document.createElement("label");
            label.htmlFor = "reception-branch-select";
            label.textContent = "損保受付";
            form.append(receptionBranchSelect, label);
            title.after(firstRow);

            reservationNameLabel.textContent = "使用者名";
            pickupLocationLabel.textContent = "配車場所";
        }
    }, false);
});

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
            pickupLocation: pickupLocation.value,
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