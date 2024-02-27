import { CarCatalog, VehicleAttributes, Navigations } from "../@types/types";
import { appendOptions } from "./common_modules.mjs";
import NoFileChosenPng from "../assets/NoFileChosen.png";

const submitButton: HTMLButtonElement = document.querySelector("#submit-button");
const imageInput: HTMLInputElement = document.querySelector("#image-input");
const imagePreview: HTMLImageElement = document.querySelector("#image-preview");
const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class");
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model");
const seatingCapacityInput: HTMLInputElement = document.querySelector("#seating-capacity");
const modelCodeSelect: HTMLSelectElement = document.querySelector("#model-code");
const modelTrimSelect: HTMLSelectElement = document.querySelector("#model-trim");
const driveTypeSelect: HTMLSelectElement = document.querySelector("#drive-type");
const transmissionSelect: HTMLSelectElement = document.querySelector("#transmission");
const bodyColorSelect: HTMLSelectElement = document.querySelector("#body-color");
const nonSmokingCheck: HTMLInputElement = document.querySelector("#non-smoking");
const insurancePriorityCheck: HTMLInputElement = document.querySelector("#insurance-priority");
const licensePlateRegionSelect: HTMLSelectElement = document.querySelector("#license-plate-region");
const licensePlateCodeInput: HTMLInputElement = document.querySelector("#license-plate-code");
const licensePlateHiraganaSelect: HTMLSelectElement = document.querySelector("#license-plate-hiragana");
const licensePlateNumberInput: HTMLInputElement = document.querySelector("#license-plate-number");
const navigationSelect: HTMLSelectElement = document.querySelector("#navigation");
const hasBackCameraCheck: HTMLInputElement = document.querySelector("#has-back-camera");
const hasDVDCheck: HTMLInputElement = document.querySelector("#has-DVD");
const hasTelevisionCheck: HTMLInputElement = document.querySelector("#has-television");
const hasExternalInputCheck: HTMLInputElement = document.querySelector("#has-external-input");
const hasETCCheck: HTMLInputElement = document.querySelector("#has-ETC");
const hasSpareKeyCheck: HTMLInputElement = document.querySelector("#has-spare-key");
const hasJAFCardCheck: HTMLInputElement = document.querySelector("#has-JAFcard");
const JAFCardNumberInput: HTMLInputElement = document.querySelector("#JAFcard-number");
const JAFCardExpInput: HTMLInputElement = document.querySelector("#JAFcard-exp");
const otherFeaturesInput: HTMLInputElement = document.querySelector("#other-features");

const getImageUrl = async (): Promise<string | null> => {
    const imageFiles: FileList | null = imageInput.files;
    if (imageFiles && imageFiles.length > 0) {
        const imageUrlPromise = new Promise<string | null>((resolve: (value: string | PromiseLike<string | null> | null) => void): void => {
            const reader: FileReader = new FileReader();
            reader.addEventListener("load", (): void => {
                const imageUrl: string = reader.result as string;
                resolve(imageUrl);
            }, false);
            reader.readAsDataURL(imageFiles[0]);
        });
        return imageUrlPromise;
    } else {
        return null;
    }
}

const replaceFullWidthNumToHalfWidthNum = (args: { element: HTMLInputElement, limitDigits?: number }): void => {
    const { element, limitDigits = undefined } = args;

    const fullWidthNumbersRegExp = new RegExp(/[０-９]/);
    const NotHalfWidthBumbersRegExp = new RegExp(/[^0-9]/);
    const fullWidthNumbers = "０１２３４５６７８９";

    element.addEventListener("input", (): void => {
        const inputtedValue = String(element.value);
        const inputtedValueLength: number = inputtedValue.length;

        element.value = element.value.replace(fullWidthNumbersRegExp, (match: string): string => {
            return fullWidthNumbersRegExp.test(match) ? String(fullWidthNumbers.indexOf(match)) : "";
        });

        element.value = element.value.replace(NotHalfWidthBumbersRegExp, "");

        if (limitDigits) {
            if (inputtedValueLength > limitDigits) {
                element.value = inputtedValue.slice(0, limitDigits);
            }
        }
    }, false);
}

imageInput.addEventListener("change", async (): Promise<void> => {
    const imageUrl: string | null = await getImageUrl();
    imageUrl ? imagePreview.setAttribute("src", imageUrl) : imagePreview.setAttribute("src", NoFileChosenPng);
}, false);

imagePreview.src = NoFileChosenPng;
replaceFullWidthNumToHalfWidthNum({ element: seatingCapacityInput, limitDigits: 2 });
replaceFullWidthNumToHalfWidthNum({ element: licensePlateCodeInput, limitDigits: 3 });
replaceFullWidthNumToHalfWidthNum({ element: licensePlateNumberInput, limitDigits: 4 });
replaceFullWidthNumToHalfWidthNum({ element: JAFCardNumberInput, limitDigits: 3 });

(async (): Promise<void> => {
    try {
        const carCatalog: CarCatalog = await window.fetchJson.carCatalog();
        const rentalClasses: string[] = Object.keys(carCatalog.rentalClass);

        const createOptions = (
            args: {
                target?: HTMLSelectElement
            }
        ): void => {
            const { target } = args;

            const selectedRentalClass: string = rentalClassSelect.value;

            if (target !== carModelSelect) {
                const carModels: string[] = Object.keys(carCatalog.rentalClass[selectedRentalClass]);
                appendOptions({
                    selectbox: carModelSelect,
                    options: carModels
                });
            }

            const selectedCarModel: string = carModelSelect.value;
            const {
                modelCode,
                modelTrim,
                driveType,
                transmission,
                bodyColor
            } = carCatalog.rentalClass[selectedRentalClass][selectedCarModel];

            appendOptions({
                selectbox: modelCodeSelect,
                options: modelCode as string[]
            });
            appendOptions({
                selectbox: modelTrimSelect,
                options: modelTrim as string[]
            });
            appendOptions({
                selectbox: driveTypeSelect,
                options: driveType as string[]
            });
            appendOptions({
                selectbox: transmissionSelect,
                options: transmission as string[]
            });
            appendOptions({
                selectbox: bodyColorSelect,
                options: bodyColor as string[]
            });
        }

        appendOptions({
            selectbox: rentalClassSelect,
            options: rentalClasses
        });

        createOptions({});

        rentalClassSelect.addEventListener("change", () => {
            createOptions({});
        }, false);

        carModelSelect.addEventListener("change", (event: Event) => {
            const target = event.target as HTMLSelectElement;
            createOptions({ target: target });
        }, false);
    } catch (error: unknown) {
        console.error("Failed to fetch carCatalog: ", error);
    }
})();

(async (): Promise<void> => {
    try {
        const jsonResponse: Navigations = await window.fetchJson.navigations();
        const navigations: string[] = jsonResponse["navigations"];

        appendOptions({ selectbox: navigationSelect, options: navigations });
    } catch (error: unknown) {
        console.error("Failed to fetch navigations: ", error);
    }
})();

submitButton.addEventListener("click", async (): Promise<void> => {
    const imageUrl: string | null = await getImageUrl();
    const vehicleAttributes: VehicleAttributes = {
        imageFileName: imageUrl,
        carModel: carModelSelect.value,
        modelCode: modelCodeSelect.value,
        modelTrim: modelTrimSelect.value,
        seatingCapacity: Number(seatingCapacityInput.value),
        nonSmoking: nonSmokingCheck.checked,
        insurancePriority: insurancePriorityCheck.checked,
        licensePlateRegion: licensePlateRegionSelect.value,
        licensePlateCode: licensePlateCodeInput.value,
        licensePlateHiragana: licensePlateHiraganaSelect.value,
        licensePlateNumber: licensePlateNumberInput.value,
        bodyColor: bodyColorSelect.value,
        driveType: driveTypeSelect.value,
        transmission: transmissionSelect.value,
        rentalClass: rentalClassSelect.value,
        navigation: navigationSelect.value,
        hasBackCamera: hasBackCameraCheck.checked,
        hasDVD: hasDVDCheck.checked,
        hasTelevision: hasTelevisionCheck.checked,
        hasExternalInput: hasExternalInputCheck.checked,
        hasETC: hasETCCheck.checked,
        hasSpareKey: hasSpareKeyCheck.checked,
        hasJAFCard: hasJAFCardCheck.checked,
        JAFCardNumber: JAFCardNumberInput.value,
        JAFCardExp: new Date(JAFCardExpInput.value),
        otherFeatures: otherFeaturesInput.value
    }

    try {
        await window.sqlInsert.vehicleAttributes(vehicleAttributes);
    } catch (error: unknown) {
        console.error("Failed to insert VehicleAttributes: ", error);
    }
}, false);