import { CarCatalog, VehicleAttributes, Navigations } from "../@types/types";
import { appendOptions } from "./common_modules.mjs";
import NoFileChosenPng from "../assets/NoFileChosen.png";

const submitButton: HTMLButtonElement = document.querySelector("#submit-button") as HTMLButtonElement;
const imageInput: HTMLInputElement = document.querySelector("#image-input") as HTMLInputElement;
const imagePreview: HTMLImageElement = document.querySelector("#image-preview") as HTMLImageElement;
const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class") as HTMLSelectElement;
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model") as HTMLSelectElement;
const modelCodeSelect: HTMLSelectElement = document.querySelector("#model-code") as HTMLSelectElement;
const driveTypeSelect: HTMLSelectElement = document.querySelector("#drive-type") as HTMLSelectElement;
const transmissionSelect: HTMLSelectElement = document.querySelector("#transmission") as HTMLSelectElement;
const bodyColorSelect: HTMLSelectElement = document.querySelector("#body-color") as HTMLSelectElement;
const nonSmokingCheck: HTMLInputElement = document.querySelector("#non-smoking") as HTMLInputElement;
const insurancePriorityCheck: HTMLInputElement = document.querySelector("#insurance-priority") as HTMLInputElement;
const licensePlateRegionSelect: HTMLSelectElement = document.querySelector("#license-plate-region") as HTMLSelectElement;
const licensePlateCodeInput: HTMLInputElement = document.querySelector("#license-plate-code") as HTMLInputElement;
const licensePlateHiraganaSelect: HTMLSelectElement = document.querySelector("#license-plate-hiragana") as HTMLSelectElement;
const licensePlateNumberInput: HTMLInputElement = document.querySelector("#license-plate-number") as HTMLInputElement;
const navigationSelect: HTMLSelectElement = document.querySelector("#navigation") as HTMLSelectElement;
const hasBackCameraCheck: HTMLInputElement = document.querySelector("#has-back-camera") as HTMLInputElement;
const hasDVDCheck: HTMLInputElement = document.querySelector("#has-DVD") as HTMLInputElement;
const hasTelevisionCheck: HTMLInputElement = document.querySelector("#has-television") as HTMLInputElement;
const hasExternalInputCheck: HTMLInputElement = document.querySelector("#has-external-input") as HTMLInputElement;
const hasSpareKeyCheck: HTMLInputElement = document.querySelector("#has-spare-key") as HTMLInputElement;
const otherFeaturesInput: HTMLInputElement = document.querySelector("#other-features") as HTMLInputElement;

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
replaceFullWidthNumToHalfWidthNum({ element: licensePlateCodeInput, limitDigits: 3 });
replaceFullWidthNumToHalfWidthNum({ element: licensePlateNumberInput, limitDigits: 4 });

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
                driveType,
                transmission,
                bodyColor
            } = carCatalog.rentalClass[selectedRentalClass][selectedCarModel];
            appendOptions({
                selectbox: modelCodeSelect,
                options: modelCode as string[]
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
        hasSpareKey: hasSpareKeyCheck.checked,
        otherFeatures: otherFeaturesInput.value
    }

    try {
        await window.sqlInsert.vehicleAttributes(vehicleAttributes);
    } catch (error: unknown) {
        console.error("Failed to insert VehicleAttributes: ", error);
    }
}, false);