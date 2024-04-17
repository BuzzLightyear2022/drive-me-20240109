import { appendOptions, setRadioValue, getRadioValue, convertToKatakana, replaceFullWidthNumToHalfWidthNum, asyncAppendOptionElements } from "./common_modules.mjs";
import { VehicleAttributes, ReservationData, LicensePlate, CarCatalog, SelectOptions } from "../@types/types";

const isRepliedCheck: HTMLInputElement = document.querySelector("#replied-check");
const receptionDateInput: HTMLInputElement = document.querySelector("#reception-date");
const repliedDateInput: HTMLInputElement = document.querySelector("#replied-date");
const salesBranchSelect: HTMLSelectElement = document.querySelector("#sales-branch");
const orderHandlerSelect: HTMLSelectElement = document.querySelector("#order-handler");
const orderSourceSelect: HTMLSelectElement = document.querySelector("#order-source");
const furiganaInput: HTMLInputElement = document.querySelector("#furigana");
const nonSmokingRadios: any = document.getElementsByName("non-smoking");
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
const vehicleIdSelect: HTMLSelectElement = document.querySelector("#license-plate");
const commentTextArea: HTMLTextAreaElement = document.querySelector("#comment-textarea");

const submitButton: HTMLButtonElement = document.querySelector("#submit-button");

isRepliedCheck.checked ? repliedDateInput.disabled = false : repliedDateInput.disabled = true;
isRepliedCheck.addEventListener("change", () => {
    isRepliedCheck.checked ? repliedDateInput.disabled = false : repliedDateInput.disabled = true;
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

(async () => {
    const crudArgs = await window.contextmenu.getCrudArgs();
    const selectOptions: SelectOptions = await window.fetchJson.selectOptions();
    const carCatalog: CarCatalog = await window.fetchJson.carCatalog();

    const branchNames: string[] = Object.keys(selectOptions.branches);
    branchNames.forEach((branchName: string) => {
        const branchOption: HTMLOptionElement = document.createElement("option");
        branchOption.textContent = `${branchName}(${selectOptions.branches[branchName].phoneNumber})`;
        branchOption.value = branchName;
        salesBranchSelect.append(branchOption);

        const pickupLocationOption: HTMLOptionElement = document.createElement("option");
        pickupLocationOption.textContent = branchName;
        pickupLocationOption.value = branchName;
        pickupLocationSelect.append(pickupLocationOption);

        const returnLocationOption: HTMLOptionElement = document.createElement("option");
        returnLocationOption.textContent = branchName;
        returnLocationOption.value = branchName;
        returnLocationSelect.append(returnLocationOption);
    });

    const staffMembers: string[] = selectOptions.staffMembers;
    await asyncAppendOptionElements({ selectElement: orderHandlerSelect, appendedOptionStrings: staffMembers });

    const orderSources: string[] = selectOptions.orderSources;
    await asyncAppendOptionElements({ selectElement: orderSourceSelect, appendedOptionStrings: orderSources });

    const orderSourceOtherOption: HTMLOptionElement = document.createElement("option");
    orderSourceOtherOption.textContent = "その他";
    orderSourceOtherOption.value = "other";
    orderSourceSelect.append(orderSourceOtherOption);

    const rentalClasses: string[] = Object.keys(carCatalog.rentalClasses);
    rentalClasses.forEach((rentalClass: string) => {
        const rentalClassOption: HTMLOptionElement = document.createElement("option");
        rentalClassOption.textContent = rentalClass;
        rentalClassOption.value = rentalClass;
        preferredRentalClassSelect.append(rentalClassOption);
    });

    const selectedRentalClass: string = preferredRentalClassSelect.value;
    const carModels: string[] = Object.keys(carCatalog.rentalClasses[selectedRentalClass]);
    carModels.forEach((carModel: string) => {
        const carModelOption: HTMLOptionElement = document.createElement("option");
        carModelOption.textContent = carModel;
        carModelOption.value = carModel;
        preferredCarModelSelect.append(carModelOption);
    });

    const carModelNoneSpecificationOption = document.createElement("option");
    carModelNoneSpecificationOption.textContent = "なし";
    carModelNoneSpecificationOption.value = null;
    preferredCarModelSelect.append(carModelNoneSpecificationOption);

    const flightCarriers: string[] = selectOptions.flightCarriers;
    flightCarriers.forEach((flightCarrier: string) => {
        const arrivalFlightCarrierOption: HTMLOptionElement = document.createElement("option");
        arrivalFlightCarrierOption.textContent = flightCarrier;
        arrivalFlightCarrierOption.value = flightCarrier;
        arrivalFlightCarrierSelect.append(arrivalFlightCarrierOption);

        const departureFlightCarrierOption: HTMLOptionElement = document.createElement("option");
        departureFlightCarrierOption.textContent = flightCarrier;
        departureFlightCarrierOption.value = flightCarrier;
        departureFlightCarrierSelect.append(departureFlightCarrierOption);
    });

    preferredRentalClassSelect.addEventListener("change", () => {
        while (preferredCarModelSelect.hasChildNodes()) {
            preferredCarModelSelect.removeChild(preferredCarModelSelect.firstChild);
        }

        const selectedRentalClass: string = preferredRentalClassSelect.value;
        const carModels: string[] = Object.keys(carCatalog.rentalClasses[selectedRentalClass]);
        carModels.forEach((carModel: string) => {
            const carModelOption: HTMLOptionElement = document.createElement("option");
            carModelOption.textContent = carModel;
            carModelOption.value = carModel;
            preferredCarModelSelect.append(carModelOption);
        });

        const newCarModelNoneSpecificationOption: HTMLOptionElement = document.createElement("option");
        newCarModelNoneSpecificationOption.textContent = "なし";
        newCarModelNoneSpecificationOption.value = null;
        preferredCarModelSelect.append(newCarModelNoneSpecificationOption);
    }, false);

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

    switch (crudArgs.crudAction) {
        case "create":
            const today: Date = new Date();
            const year: number = today.getFullYear();
            const month: string = String(today.getMonth() + 1);
            const date: string = String(today.getDate());
            const todayString: string = `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}`;
            receptionDateInput.value = todayString;

            if (crudArgs.vehicleId) {
                const vehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: crudArgs.vehicleId });

                const rentalClassOption: HTMLOptionElement = document.createElement("option");
                rentalClassOption.textContent = vehicleAttributes.rentalClass;
                rentalClassOption.value = vehicleAttributes.rentalClass;
                rentalClassSelect.append(rentalClassOption);
                rentalClassSelect.disabled = true;

                const carModelOption: HTMLOptionElement = document.createElement("option");
                carModelOption.textContent = vehicleAttributes.carModel;
                carModelOption.value = vehicleAttributes.carModel;
                carModelSelect.append(carModelOption);
                carModelSelect.disabled = true;

                const vehicleIdOption: HTMLOptionElement = document.createElement("option");
                const licensePlateString: string = `${vehicleAttributes.licensePlateRegion} ${vehicleAttributes.licensePlateCode} ${vehicleAttributes.licensePlateHiragana} ${vehicleAttributes.licensePlateNumber}`;
                const nonSmokingString: string = vehicleAttributes.nonSmoking ? "禁煙" : "喫煙";
                vehicleIdOption.textContent = `${licensePlateString} (${nonSmokingString})`;
                vehicleIdSelect.append(vehicleIdOption);
                vehicleIdOption.value = String(vehicleAttributes.id);
                vehicleIdSelect.disabled = true;
            } else {
                const rentalClassOptions: string[] = await window.sqlSelect.rentalClasses({ selectedSmoking: null });
                rentalClassOptions.forEach((rentalClass: string) => {
                    const rentalClassOption: HTMLOptionElement = document.createElement("option");
                    rentalClassOption.textContent = rentalClass;
                    rentalClassOption.value = rentalClass;
                    rentalClassSelect.append(rentalClassOption);
                });

                const selectedRentalClass = rentalClassSelect.value;
                const carModelOptions: string[] = await window.sqlSelect.carModels({ selectedSmoking: "none-specification", selectedRentalClass: selectedRentalClass });
                carModelOptions.forEach((carModel: string) => {
                    const carModelOption: HTMLOptionElement = document.createElement("option");
                    carModelOption.textContent = carModel;
                    carModelOption.value = carModel;
                    carModelSelect.append(carModelOption);
                });

                const selectedCarModel: string = carModelSelect.value;
                const licensePlates: LicensePlate[] = await window.sqlSelect.licensePlates({ selectedSmoking: "none-specification", selectedCarModel: selectedCarModel });
                licensePlates.forEach((licensePlate: LicensePlate) => {
                    const licensePlateOption: HTMLOptionElement = document.createElement("option");
                    licensePlateOption.textContent = `${licensePlate.licensePlate} (${licensePlate.nonSmoking ? "禁煙" : "喫煙"
                        })`;
                    licensePlateOption.value = String(licensePlate.id);
                    vehicleIdSelect.append(licensePlateOption);
                })
            }
            break;
        case "update":
            const existingReservationData: ReservationData = await window.sqlSelect.reservationDataById({ reservationId: crudArgs.reservationId });

            isRepliedCheck.checked = existingReservationData.isReplied;
            receptionDateInput.value = String(existingReservationData.receptionDate);

            if (existingReservationData.isReplied) {
                repliedDateInput.disabled = false;
            }

            if (existingReservationData.repliedDatetime) {
                const repliedDateObject: Date = new Date(existingReservationData.repliedDatetime);
                const repliedYear: number = repliedDateObject.getFullYear();
                const repliedMonth: string = String(repliedDateObject.getMonth() + 1).padStart(2, "0");
                const repliedDate: string = String(repliedDateObject.getDate()).padStart(2, "0");
                const repliedTime: string = String(repliedDateObject.getHours()).padStart(2, "0");
                const repliedMinutes: string = String(repliedDateObject.getMinutes()).padStart(2, "0");
                const repliedDateString: string = `${repliedYear}-${repliedMonth}-${repliedDate}T${repliedTime}:${repliedMinutes}`;
                repliedDateInput.value = repliedDateString;
            }

            salesBranchSelect.value = existingReservationData.salesBranch;
            orderHandlerSelect.value = existingReservationData.orderHandler;
            orderSourceSelect.value = existingReservationData.orderSource;
            furiganaInput.value = existingReservationData.userNameFurigana;
            setRadioValue({ radios: nonSmokingRadios, checkedValue: existingReservationData.nonSmoking });
            userNameInput.value = existingReservationData.userName;
            preferredRentalClassSelect.value = existingReservationData.preferredRentalClass;
            isElevatableCheck.checked = existingReservationData.isElevatable;
            isClassSpecifiedCheck.checked = existingReservationData.isClassSpecified;
            applicantNameInput.value = existingReservationData.applicantName;

            while (preferredCarModelSelect.firstChild) {
                preferredCarModelSelect.removeChild(preferredCarModelSelect.firstChild);
            }
            await asyncAppendOptionElements({ selectElement: preferredCarModelSelect, appendedOptionStrings: Object.keys(carCatalog.rentalClasses[existingReservationData.preferredRentalClass]) });
            preferredCarModelSelect.value = existingReservationData.preferredCarModel;

            if (existingReservationData.applicantZipCode) {
                zipCodeFirstInput.value = String(existingReservationData.applicantZipCode).slice(0, 3);
                zipCodeLastInput.value = String(existingReservationData.applicantZipCode).slice(-4);
            }

            addressInput.value = existingReservationData.applicantAddress;

            if (existingReservationData.applicantPhoneNumber) {
                phoneNumberInput.value = String(existingReservationData.applicantPhoneNumber);
            }

            pickupLocationSelect.value = existingReservationData.pickupLocation;
            returnLocationSelect.value = existingReservationData.returnLocation;

            const existingPickupDatetime: Date = new Date(existingReservationData.pickupDatetime);
            const existingPickupDatetimeString: String = existingPickupDatetime.toISOString();
            console.log(existingPickupDatetimeString);
            // pickupDatetimeInput.value = String(existingReservationData.pickupDatetime);
            break;
    }

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
            selectedVehicleId: Number(vehicleIdSelect.value),
            comment: commentTextArea.value,
            isCanceled: false,
            createdAt: null,
            updatedAt: null
        }

        switch (crudArgs.crudAction) {
            case "create":
                try {
                    await window.sqlInsert.reservationData(reservationData);
                } catch (error: unknown) {
                    console.error(`Failed to invoke reservationData: ${error}`);
                }
            case "update":
                try {
                    await window.sqlUpdate.reservationData(reservationData);
                } catch (error: unknown) {
                    console.error(`Failed to update reservationData: ${error}`)
                }
        }
    }, false)

    // if (vehicleId) {
    //     const vehicleAttributes: VehicleAttributes = await window.sqlSelect.vehicleAttributesById({ vehicleId: vehicleId });

    //     rentalClassSelect.disabled = true;
    //     const rentalClassOption = document.createElement("option");
    //     rentalClassOption.textContent = vehicleAttributes.rentalClass;
    //     rentalClassSelect.append(rentalClassOption);
    //     rentalClassSelect.value = vehicleAttributes.rentalClass;

    //     carModelSelect.disabled = true;
    //     const carModelOption = document.createElement("option");
    //     carModelOption.textContent = vehicleAttributes.carModel;
    //     carModelSelect.append(carModelOption);
    //     carModelSelect.value = vehicleAttributes.carModel;

    //     selectedVehicleId.disabled = true;
    //     const selectedVehicleIdOption = document.createElement("option");
    //     selectedVehicleIdOption.value = String(vehicleAttributes.id);
    //     const nonSmokingString = vehicleAttributes.nonSmoking ? "禁煙車" : "喫煙車";
    //     const selectedVehicleIdString = `${vehicleAttributes.licensePlateRegion} ${vehicleAttributes.licensePlateCode} ${vehicleAttributes.licensePlateHiragana} ${vehicleAttributes.licensePlateNumber} (${nonSmokingString})`;
    //     selectedVehicleIdOption.textContent = selectedVehicleIdString;
    //     selectedVehicleId.append(selectedVehicleIdOption);
    // } else {
    //     const reservationId: number = await window.contextmenu.getReservationId();
    //     const currentReservationData: ReservationData = await window.sqlSelect.reservationDataById({ reservationId: reservationId })

    //     if (currentReservationData.repliedDatetime) {
    //         const systemTimezone: string = await window.systemTimezone.getSystemTimezone();

    //         const formatter = new Intl.DateTimeFormat("ja-JP", {
    //             timeZone: systemTimezone,
    //             year: "numeric",
    //             month: "2-digit",
    //             day: "2-digit",
    //             hour: "2-digit",
    //             minute: "2-digit"
    //         });

    //         const formattedRepliedDatetime: string = formatter.format(new Date(currentReservationData.repliedDatetime));
    //         const formattedDatetimeString: string = formattedRepliedDatetime.replaceAll("/", "-").replace(" ", "T");
    // repliedDatetimeInput.value = formattedDatetimeString;
    // }

    // salesBranchSelect.value = currentReservationData.salesBranch;
    // orderHandlerSelect.value = currentReservationData.orderHandler;
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
    // }
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

// (async () => {
//     submitButton.addEventListener("click", async () => {
//         // const crudArgs = await window.contextmenu.getCrudArgs();
//         // console.log(crudArgs);

//     }, false);
// })();