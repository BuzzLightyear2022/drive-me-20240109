import { CarCatalog, VehicleAttributes, Navigations } from "../@types/types";
import { appendOptions } from "./common_modules.mjs";
import NoImagePng from "../assets/NoImage.png";
import squareAndArrowUpCircleFill from "../assets/square.and.arrow.up.circle.fill@2x.png";
import { VehicleAttributesItem } from "./display_reservation/vehicle_attributes_item.mjs";

const submitButton: HTMLButtonElement = document.querySelector("#submit-button") as HTMLButtonElement;
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

let isImageChanged: boolean = false;

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

const createOptions = (
    args: {
        carCatalog: CarCatalog,
        target?: HTMLSelectElement
    }
): void => {
    const { carCatalog, target } = args;

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

replaceFullWidthNumToHalfWidthNum({ element: licensePlateCodeInput, limitDigits: 3 });
replaceFullWidthNumToHalfWidthNum({ element: licensePlateNumberInput, limitDigits: 4 });

window.contextMenu.getVehicleId(async (vehicleId: string) => {
    const currentVehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: vehicleId });

    const carCatalog: CarCatalog = await window.fetchJson.carCatalog();
    const jsonResponse: Navigations = await window.fetchJson.navigations();
    const navigations: string[] = jsonResponse["navigations"];

    const serverHost: string = await window.serverInfo.serverHost();
    const port: string = await window.serverInfo.port();
    const imageDirectory: string = await window.serverInfo.imageDirectory();

    const imagePath = `http://${serverHost}:${port}/${imageDirectory}/${currentVehicleAttributes.imageFileName}`;

    const img = new Image();
    img.src = imagePath;

    img.onload = () => {
        imagePreview.src = imagePath;
    };

    img.onerror = () => {
        imagePreview.src = NoImagePng;
    }

    const rentalClasses: string[] = Object.keys(carCatalog.rentalClass);
    appendOptions({
        selectbox: rentalClassSelect,
        options: rentalClasses
    });
    rentalClassSelect.value = currentVehicleAttributes.rentalClass;

    const selectedRentalClass: string = rentalClassSelect.value;
    appendOptions({ selectbox: carModelSelect, options: Object.keys(carCatalog.rentalClass[selectedRentalClass]) });
    carModelSelect.value = currentVehicleAttributes.carModel;

    const selectedCarModel: string = carModelSelect.value;
    appendOptions({ selectbox: modelCodeSelect, options: carCatalog.rentalClass[selectedRentalClass][selectedCarModel].modelCode });
    modelCodeSelect.value = currentVehicleAttributes.modelCode;

    appendOptions({ selectbox: driveTypeSelect, options: carCatalog.rentalClass[selectedRentalClass][selectedCarModel].driveType });
    driveTypeSelect.value = currentVehicleAttributes.driveType;

    appendOptions({ selectbox: transmissionSelect, options: carCatalog.rentalClass[selectedRentalClass][selectedCarModel].transmission });
    transmissionSelect.value = currentVehicleAttributes.transmission;

    appendOptions({ selectbox: bodyColorSelect, options: carCatalog.rentalClass[selectedRentalClass][selectedCarModel].bodyColor });
    bodyColorSelect.value = currentVehicleAttributes.bodyColor;

    licensePlateRegionSelect.value = currentVehicleAttributes.licensePlateRegion;
    licensePlateCodeInput.value = currentVehicleAttributes.licensePlateCode;
    licensePlateHiraganaSelect.value = currentVehicleAttributes.licensePlateHiragana;
    licensePlateNumberInput.value = currentVehicleAttributes.licensePlateNumber;
    nonSmokingCheck.checked = currentVehicleAttributes.nonSmoking;
    insurancePriorityCheck.checked = currentVehicleAttributes.insurancePriority;

    appendOptions({ selectbox: navigationSelect, options: navigations });
    navigationSelect.value = currentVehicleAttributes.navigation;

    hasBackCameraCheck.checked = currentVehicleAttributes.hasBackCamera;
    hasDVDCheck.checked = currentVehicleAttributes.hasDVD;
    hasTelevisionCheck.checked = currentVehicleAttributes.hasTelevision;
    hasExternalInputCheck.checked = currentVehicleAttributes.hasExternalInput;
    hasSpareKeyCheck.checked = currentVehicleAttributes.hasSpareKey;
    otherFeaturesInput.value = currentVehicleAttributes.otherFeatures;

    rentalClassSelect.addEventListener("change", () => {
        createOptions({ carCatalog: carCatalog });
    }, false);

    carModelSelect.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLSelectElement;
        createOptions({ carCatalog: carCatalog, target: target });
    }, false);

    imagePreview.parentElement.addEventListener("click", async () => {
        try {
            const imageUrl = await window.dialog.openFile();
            if (imageUrl) {
                imagePreview.src = imageUrl;
                isImageChanged = true;
            } else {
                imagePreview.src = currentVehicleAttributes.imageFileName ? imagePath : NoImagePng;
                isImageChanged = false;
            }
        } catch (error: unknown) {
            console.error(error);
        }
    }, false);

    submitButton.addEventListener("click", async (): Promise<void> => {
        const imageUrl: string | null = imagePreview.src;
        const vehicleAttributes: VehicleAttributes = {
            id: currentVehicleAttributes.id,
            imageFileName: null,
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

        if (isImageChanged) {
            vehicleAttributes.imageFileName = imageUrl;
        }

        try {
            await window.sqlUpdate.vehicleAttributes(vehicleAttributes);
        } catch (error: unknown) {
            console.error("Failed to insert VehicleAttributes: ", error);
        }
    }, false);
});

const overlayElement = document.createElement("div");
Object.assign(overlayElement.style, {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    width: "50px",
    height: "50px",
    backgroundImage: `url(${squareAndArrowUpCircleFill})`,
    backgroundSize: "cover",
    zIndex: "1"
});

imagePreview.parentElement.addEventListener("mouseenter", () => {
    imagePreview.parentElement.append(overlayElement);
}, false);

imagePreview.parentElement.addEventListener("mouseleave", () => {
    overlayElement.remove();
}, false);

overlayElement.addEventListener("mouseenter", (event: MouseEvent) => {
    event.stopPropagation();
}, false);

overlayElement.addEventListener("mouseleave", (event: MouseEvent) => {
    event.stopPropagation();
}, false);

imagePreview.addEventListener("dragstart", (event: MouseEvent) => {
    event.preventDefault();
}, false);