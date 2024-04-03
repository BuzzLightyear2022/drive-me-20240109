import { appendOptions, setRadioValue, getRadioValue, convertToKatakana, replaceFullWidthNumToHalfWidthNum } from "./common_modules.mjs";
import { VehicleAttributes, ReservationData, LicensePlatesData, CarCatalog } from "../@types/types";

const isRepliedCheck: HTMLInputElement = document.querySelector("#replied-check");
const receptionDateInput: HTMLInputElement = document.querySelector("#reception-date");
const repliedDateInput: HTMLInputElement = document.querySelector("#replied-date");
const salesBranchSelect: HTMLSelectElement = document.querySelector("#sales-branch");
const orderHandlerSelect: HTMLSelectElement = document.querySelector("#order-handler");
const orderSourceSelect: HTMLSelectElement = document.querySelector("#order-source");
const furiganaInput: HTMLInputElement = document.querySelector("#furigana");
const nonSmokingRadios: NodeListOf<HTMLElement> = document.getElementsByName("non-smoking");
const userNameInput: HTMLInputElement = document.querySelector("#user-name");
const preferredRentalClassSelect: HTMLSelectElement = document.querySelector("#preferred-rental-class");
const isElevatableCheck: HTMLInputElement = document.querySelector("#is-elevatable");
const isClassSpecifiedCheck: HTMLInputElement = document.querySelector("#is-class-specified");
const applicantNameInput: HTMLInputElement = document.querySelector("#applicantName");
const preferredCarModelSelect: HTMLSelectElement = document.querySelector("#preferred-car-model");
const zipCodeFirstInput: HTMLInputElement = document.querySelector("#zip-code-first");
const zipCodeLastInput: HTMLInputElement = document.querySelector("#zip-code-last");
const addressInput: HTMLInputElement = document.querySelector("#address");
const phoneNumberInput: HTMLInputElement = document.querySelector("#phone-number");
const pickupLocationSelect: HTMLSelectElement = document.querySelector("#pickup-location");
const returnLocationSelect: HTMLSelectElement = document.querySelector("#return-location");
const pickupDatetimeInput: HTMLInputElement = document.querySelector("#pickup-datetime");
const arrivalFlightCarrierSelect: HTMLSelectElement = document.querySelector("#arrival-flight-carrier");
const arrivalFlightNumberInput: HTMLInputElement = document.querySelector("#arrival-flight-number");
const arrivalFlightTimeInput: HTMLInputElement = document.querySelector("#arrival-flight-time");
const returnDatetimeInput: HTMLInputElement = document.querySelector("#return-datetime");
const departureFlightCarrierSelect: HTMLSelectElement = document.querySelector("#departure-flight-carrier");
const departureFlightNumberInput: HTMLInputElement = document.querySelector("#departure-flight-number");
const departureFlightTimeInput: HTMLInputElement = document.querySelector("#departure-flight-time");
const rentalClassSelect: HTMLSelectElement = document.querySelector("#rental-class");
const carModelSelect: HTMLSelectElement = document.querySelector("#car-model");
const selectedVehicleId: HTMLSelectElement = document.querySelector("#license-plate");
const commentTextArea: HTMLTextAreaElement = document.querySelector("#comment-textarea");

const submitButton: HTMLButtonElement = document.querySelector("#submit-button");

(async () => {
    const vehicleId: number = await window.contextmenu.getVehicleId();
    const selectOptions: any = await window.fetchJson.selectOptions();
    const carCatalog: CarCatalog = await window.fetchJson.carCatalog();

    const branches = selectOptions.branches;
    const branchNames: string[] = Object.keys(branches);

    const staffMembers = selectOptions.staffMembers;
    const orderSources = selectOptions.orderSources;
    const rentalClasses: string[] = Object.keys(carCatalog.rentalClass);
    const flightCarriers: string[] = selectOptions.flightCarriers;

    const today: Date = new Date();
    const year: string = today.getFullYear().toString();
    const month: string = (today.getMonth() + 1).toString().padStart(2, "0");
    const date: string = today.getDate().toString().padStart(2, "0");
    const formattedDate: string = `${year}-${month}-${date}`;

    receptionDateInput.value = formattedDate;

    isRepliedCheck.checked ? repliedDateInput.disabled = false : repliedDateInput.disabled = true;
    isRepliedCheck.addEventListener("change", () => {
        isRepliedCheck.checked ? repliedDateInput.disabled = false : repliedDateInput.disabled = true;
    }, false);

    branchNames.forEach((branchName: string, index: number) => {
        const option = document.createElement("option");
        option.textContent = `${branchName}(${branches[branchName].phoneNumber})`;
        option.value = branchName;
        salesBranchSelect.append(option);

        const pickupLocationOption = document.createElement("option");
        pickupLocationOption.textContent = branchName;
        option.value = branchName;
        pickupLocationSelect.append(pickupLocationOption);

        const returnLocationOption = document.createElement("option");
        returnLocationOption.textContent = branchName
        option.value = branchName;
        returnLocationSelect.append(returnLocationOption);
    });

    staffMembers.forEach((staff: string) => {
        const option = document.createElement("option");
        option.textContent = staff;
        orderHandlerSelect.append(option);
    });

    orderSources.forEach((orderSource: string) => {
        const option = document.createElement("option");
        option.textContent = orderSource;
        orderSourceSelect.append(option);
    });

    furiganaInput.addEventListener("input", () => {
        const inputValue: string = furiganaInput.value;
        const convertedValue: string = convertToKatakana(inputValue);
        furiganaInput.value = convertedValue;
    }, false);

    rentalClasses.forEach((rentalClass: string) => {
        const option = document.createElement("option");
        option.textContent = rentalClass;
        preferredRentalClassSelect.append(option);
    });

    const initialSelectedRentalClass = preferredRentalClassSelect.value;

    const carModelNoneSpecificationOption = document.createElement("option");
    carModelNoneSpecificationOption.textContent = "なし";
    carModelNoneSpecificationOption.value = null;
    preferredCarModelSelect.append(carModelNoneSpecificationOption);

    const initialCarModels: string[] = Object.keys(carCatalog.rentalClass[initialSelectedRentalClass]);
    initialCarModels.forEach((carModel: string) => {
        const option = document.createElement("option");
        option.textContent = carModel;
        preferredCarModelSelect.append(option);
    });

    flightCarriers.forEach((flightCarrier: string) => {
        const arrivalOption = document.createElement("option");
        arrivalOption.textContent = flightCarrier;
        arrivalFlightCarrierSelect.append(arrivalOption);

        const departureOption = document.createElement("option");
        departureOption.textContent = flightCarrier;
        departureFlightCarrierSelect.append(departureOption);
    });

    preferredRentalClassSelect.addEventListener("change", () => {
        while (preferredCarModelSelect.firstChild) {
            preferredCarModelSelect.removeChild(preferredCarModelSelect.firstChild);
        }

        const selectedRentalClass: string = preferredRentalClassSelect.value;

        const carModelNoneSpecificationOption = document.createElement("option");
        carModelNoneSpecificationOption.textContent = "なし";
        carModelNoneSpecificationOption.value = null;
        preferredCarModelSelect.append(carModelNoneSpecificationOption);

        const carModels = Object.keys(carCatalog.rentalClass[selectedRentalClass]);
        carModels.forEach((carModel) => {
            const option = document.createElement("option");
            option.textContent = carModel;
            preferredCarModelSelect.append(option);
        });
    }, false);

    replaceFullWidthNumToHalfWidthNum({ element: zipCodeFirstInput, limitDigits: 3 });
    replaceFullWidthNumToHalfWidthNum({ element: zipCodeLastInput, limitDigits: 4 });
    replaceFullWidthNumToHalfWidthNum({ element: phoneNumberInput });
    replaceFullWidthNumToHalfWidthNum({ element: arrivalFlightNumberInput, limitDigits: 4 })
    replaceFullWidthNumToHalfWidthNum({ element: departureFlightNumberInput, limitDigits: 4 });

    pickupDatetimeInput.addEventListener("change", () => {
        const pickupDatetimeValue = pickupDatetimeInput.value;
        const returnDatetimeValue = returnDatetimeInput.value;

        if (returnDatetimeValue < pickupDatetimeValue) {
            const invalidFeedbackDiv = document.createElement("div");
            invalidFeedbackDiv.className = "alert alert-danger";
            invalidFeedbackDiv.role = "alert";
            invalidFeedbackDiv.textContent = "貸出日時より過去の日付を指定することはできません";

            const existingError = document.querySelector(".alert");
            if (existingError) {
                existingError.remove();
            }

            returnDatetimeInput.parentElement.appendChild(invalidFeedbackDiv);
        } else {
            const warningElement = document.querySelector(".alert");
            warningElement.remove();
        }
    }, false);

    returnDatetimeInput.addEventListener("change", () => {
        const pickupDatetimeValue = pickupDatetimeInput.value;
        const returnDatetimeValue = returnDatetimeInput.value;

        if (returnDatetimeValue < pickupDatetimeValue) {
            const invalidFeedbackDiv = document.createElement("div");
            invalidFeedbackDiv.className = "alert alert-danger";
            invalidFeedbackDiv.role = "alert";
            invalidFeedbackDiv.textContent = "貸出日時より過去の日付を指定することはできません";

            const existingError = document.querySelector(".alert");
            if (existingError) {
                existingError.remove();
            }

            returnDatetimeInput.parentElement.appendChild(invalidFeedbackDiv);
        } else {
            const warningElement = document.querySelector(".alert");
            warningElement.remove();
        }
    }, false);

    if (vehicleId) {
        const vehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: vehicleId });

        rentalClassSelect.disabled = true;
        const rentalClassOption = document.createElement("option");
        rentalClassOption.textContent = vehicleAttributes.rentalClass;
        rentalClassSelect.append(rentalClassOption);
        rentalClassSelect.value = vehicleAttributes.rentalClass;

        carModelSelect.disabled = true;
        const carModelOption = document.createElement("option");
        carModelOption.textContent = vehicleAttributes.carModel;
        carModelSelect.append(carModelOption);
        carModelSelect.value = vehicleAttributes.carModel;

        selectedVehicleId.disabled = true;
        const selectedVehicleIdOption = document.createElement("option");
        selectedVehicleIdOption.value = String(vehicleAttributes.id);
        const nonSmokingString = vehicleAttributes.nonSmoking ? "禁煙車" : "喫煙車";
        const selectedVehicleIdString = `${vehicleAttributes.licensePlateRegion} ${vehicleAttributes.licensePlateCode} ${vehicleAttributes.licensePlateHiragana} ${vehicleAttributes.licensePlateNumber} (${nonSmokingString})`;
        selectedVehicleIdOption.textContent = selectedVehicleIdString;
        selectedVehicleId.append(selectedVehicleIdOption);
    } else {
        // const rentalClasses: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: selectedSmoking });
        // appendOptions({ selectbox: rentalClassSelect, options: rentalClasses });

        // const selectedRentalClass: string = rentalClassSelect.value;
        // const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });

        // appendOptions({ selectbox: carModelSelect, options: carModels });

        // const selectedCarModel: string = carModelSelect.value;
        // const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
        // const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
        //     return licensePlateData.licensePlate;
        // });
        // const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
        //     return licensePlateData.id;
        // });

        // appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
    }
})();

// nonSmokingRadios.forEach((nonSmokingRadio: HTMLInputElement) => {
//     nonSmokingRadio.addEventListener("change", async () => {
//         const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });

//         const rentalClasses: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: selectedSmoking });

//         appendOptions({ selectbox: rentalClassSelect, options: rentalClasses });

//         const selectedRentalClass: string = rentalClassSelect.value;
//         const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });

//         appendOptions({ selectbox: carModelSelect, options: carModels });

//         const selectedCarModel: string = carModelSelect.value;
//         const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
//         const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
//             return licensePlateData.licensePlate;
//         });
//         const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
//             return licensePlateData.id;
//         });

//         appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
//     }, false);
// });

// rentalClassSelect.addEventListener("change", async () => {
//     const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });

//     const selectedRentalClass: string = rentalClassSelect.value;
//     const carModels: string[] = await window.sqlSelect.carModels({ selectedSmoking: selectedSmoking, selectedRentalClass: selectedRentalClass });

//     appendOptions({ selectbox: carModelSelect, options: carModels });

//     const selectedCarModel: string = carModelSelect.value;
//     const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
//     const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
//         return licensePlateData.licensePlate;
//     });
//     const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
//         return licensePlateData.id;
//     });

//     appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
// }, false);

// carModelSelect.addEventListener("change", async () => {
//     const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-spacification" });
//     const selectedCarModel: string = carModelSelect.value;
//     const licensePlatesData: LicensePlatesData = await window.sqlSelect.licensePlates({ selectedSmoking: selectedSmoking, selectedCarModel: selectedCarModel });
//     const licensePlatesArray: string[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }): string => {
//         return licensePlateData.licensePlate;
//     });
//     const idsArray: number[] = licensePlatesData.map((licensePlateData: { id: number, licensePlate: string }) => {
//         return licensePlateData.id;
//     });

//     appendOptions({ selectbox: licensePlateSelect, options: licensePlatesArray, values: idsArray });
// }, false);

// rentalCategoryRadios.forEach((radio: HTMLInputElement) => {
//     radio.addEventListener("change", () => {
//         const selectedRentalCategory: string = getRadioValue({ radios: rentalCategoryRadios });
//         if (selectedRentalCategory === "loanerRental") {
//             const firstRow = document.createElement("div");
//             firstRow.className = "row";
//             const firstCol = document.createElement("div");
//             firstCol.className = "col-md";
//             const form = document.createElement("div");
//             form.className = "form-floating p-1";
//             firstRow.append(firstCol);
//             firstCol.append(form);

//             const receptionBranches = ["本店", "AP"];
//             const receptionBranchSelect: HTMLSelectElement = document.createElement("select");
//             receptionBranchSelect.id = "reception-branch-select";
//             receptionBranchSelect.className = "form-select";
//             receptionBranches.forEach((branch) => {
//                 const option = document.createElement("option");
//                 option.textContent = branch;
//                 receptionBranchSelect.append(option);
//             });
//             const label = document.createElement("label");
//             label.htmlFor = "reception-branch-select";
//             label.textContent = "損保受付";
//             form.append(receptionBranchSelect, label);
//             title.after(firstRow);

//             reservationNameLabel.textContent = "使用者名";
//             pickupLocationLabel.textContent = "配車場所";
//         }
//     }, false);
// });

(async () => {
    submitButton.addEventListener("click", async () => {
        const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-specification" });
        const repliedDatetime = isRepliedCheck.checked ? new Date(repliedDateInput.value) : null;

        const reservationData: ReservationData = {
            isReplied: isRepliedCheck.checked,
            receptionDate: new Date(receptionDateInput.value),
            repliedDatetime: repliedDatetime,
            salesBranch: salesBranchSelect.value,
            orderHandler: orderHandlerSelect.value,
            orderSource: orderSourceSelect.value,
            userNameFurigana: furiganaInput.value,
            nonSmoking: selectedSmoking,
            userName: userNameInput.value,
            preferredRentalClass: preferredRentalClassSelect.value,
            isElevatable: isElevatableCheck.checked,
            isClassSpecified: isClassSpecifiedCheck.checked,
            applicantName: applicantNameInput.value,
            preferredCarModel: preferredCarModelSelect.value,
            applicantZipCode: Number(`${zipCodeFirstInput.value}${zipCodeLastInput.value}`),
            applicantAddress: addressInput.value,
            applicantPhoneNumber: Number(phoneNumberInput.value),
            pickupLocation: pickupLocationSelect.value,
            returnLocation: returnLocationSelect.value,
            pickupDatetime: new Date(pickupDatetimeInput.value),
            arrivalFlightCarrier: arrivalFlightCarrierSelect.value,
            arrivalFlightNumber: Number(arrivalFlightNumberInput.value),
            arrivalFlightTime: arrivalFlightTimeInput.value,
            returnDatetime: new Date(returnDatetimeInput.value),
            departureFlightCarrier: departureFlightCarrierSelect.value,
            departureFlightNumber: Number(departureFlightNumberInput.value),
            departureFlightTime: departureFlightTimeInput.value,
            selectedRentalClass: rentalClassSelect.value,
            selectedCarModel: carModelSelect.value,
            selectedVehicleId: Number(selectedVehicleId.value),
            comment: commentTextArea.value,
            isCanceled: false,
            createdAt: null,
            updatedAt: null
        }

        console.log(reservationData);

        try {
            await window.sqlInsert.reservationData(reservationData);
        } catch (error: unknown) {
            console.error(`Failed to invoke reservationData: ${error}`);
        }
    }, false);
})();