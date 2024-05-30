import { Reservation, CarCatalog, SelectOptions } from "../@types/types";
import { setRadioValue, getRadioValue, convertToKatakana, replaceFullWidthNumToHalfWidthNum, asyncAppendOptionElements, formatDateForInput, formatDatetimeForInput } from "./common_modules/common_modules.mjs";
import { rentalCarOptionsHandler } from "./common_modules/rentalCar_options_handler.mjs";

const titleElement: HTMLElement = document.querySelector("#title-element");
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
const rentalCarIdSelect: HTMLSelectElement = document.querySelector("#rentalCar-id");
const commentTextArea: HTMLTextAreaElement = document.querySelector("#comment-textarea");

const submitButton: HTMLButtonElement = document.querySelector("#submit-button");

const isRepliedCheckHandler = () => {
    const checkboxDisabledController = {
        handleEvent: () => {
            isRepliedCheck.checked ? repliedDateInput.disabled = false : repliedDateInput.disabled = true;
        }
    }

    checkboxDisabledController.handleEvent();
    isRepliedCheck.addEventListener("change", checkboxDisabledController, false);
}

const validateDateInput = () => {
    pickupDatetimeInput.addEventListener("input", () => {
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
            if (warningElement) {
                warningElement.remove();
            }
        }
    }, false);

    returnDatetimeInput.addEventListener("input", () => {
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
            if (warningElement) {
                warningElement.remove();
            }
        }
    }, false);
}

const populateFormInputs = async (args: { reservationId: string, carCatalog: CarCatalog }) => {
    const { reservationId, carCatalog } = args;
    const existingReservationData: Reservation = await window.sqlSelect.reservationById({ reservationId: reservationId });

    isRepliedCheck.checked = existingReservationData.isReplied;

    const receptionDateObject: Date = new Date(existingReservationData.receptionDate);
    const receptionDateString: string = formatDateForInput({ dateObject: receptionDateObject });
    receptionDateInput.value = receptionDateString;

    if (existingReservationData.isReplied) {
        repliedDateInput.disabled = false;
    }

    if (existingReservationData.repliedDatetime) {
        const repliedDateString: string = formatDatetimeForInput({ dateObject: new Date(existingReservationData.repliedDatetime) });
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

    const pickupDatetimeString: string = formatDatetimeForInput({ dateObject: new Date(existingReservationData.pickupDatetime) });
    pickupDatetimeInput.value = pickupDatetimeString;

    arrivalFlightCarrierSelect.value = existingReservationData.arrivalFlightCarrier;
    arrivalFlightNumberInput.value = String(existingReservationData.arrivalFlightNumber);
    arrivalFlightTimeInput.value = existingReservationData.arrivalFlightTime;

    const returnDatetimeString: string = formatDatetimeForInput({ dateObject: new Date(existingReservationData.returnDatetime) });
    returnDatetimeInput.value = returnDatetimeString;
    departureFlightCarrierSelect.value = existingReservationData.departureFlightCarrier;
    departureFlightNumberInput.value = String(existingReservationData.departureFlightNumber);
    departureFlightTimeInput.value = existingReservationData.departureFlightTime;

    await rentalCarOptionsHandler({ rentalCarId: existingReservationData.selectedVehicleId });
}

const getSubmitData = (args: { crudArgs: any }): Reservation => {
    const { crudArgs } = args;

    const selectedSmoking: string = getRadioValue({ radios: nonSmokingRadios, defaultValue: "none-specification" });
    const repliedDatetime = isRepliedCheck.checked ? new Date(repliedDateInput.value) : null;

    return {
        id: crudArgs.reservationId,
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
        applicantZipCode: `${zipCodeFirstInput.value}${zipCodeLastInput.value}`,
        applicantAddress: addressInput.value,
        applicantPhoneNumber: phoneNumberInput.value,
        pickupLocation: pickupLocationSelect.value,
        returnLocation: returnLocationSelect.value,
        pickupDatetime: new Date(pickupDatetimeInput.value),
        arrivalFlightCarrier: arrivalFlightCarrierSelect.value,
        arrivalFlightNumber: arrivalFlightNumberInput.value,
        arrivalFlightTime: arrivalFlightTimeInput.value,
        returnDatetime: new Date(returnDatetimeInput.value),
        departureFlightCarrier: departureFlightCarrierSelect.value,
        departureFlightNumber: departureFlightNumberInput.value,
        departureFlightTime: departureFlightTimeInput.value,
        selectedRentalClass: rentalClassSelect.value,
        selectedCarModel: carModelSelect.value,
        selectedVehicleId: rentalCarIdSelect.value,
        comment: commentTextArea.value,
        isCanceled: false,
        cancelComment: null,
        createdAt: null,
        updatedAt: null
    }
}

isRepliedCheckHandler();
replaceFullWidthNumToHalfWidthNum({ element: zipCodeFirstInput, limitDigits: 3 });
replaceFullWidthNumToHalfWidthNum({ element: zipCodeLastInput, limitDigits: 4 });
replaceFullWidthNumToHalfWidthNum({ element: phoneNumberInput });
validateDateInput();
replaceFullWidthNumToHalfWidthNum({ element: arrivalFlightNumberInput, limitDigits: 4 })
replaceFullWidthNumToHalfWidthNum({ element: departureFlightNumberInput, limitDigits: 4 });
convertToKatakana(furiganaInput);

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
    await asyncAppendOptionElements({ selectElement: arrivalFlightCarrierSelect, appendedOptionStrings: flightCarriers });
    await asyncAppendOptionElements({ selectElement: departureFlightCarrierSelect, appendedOptionStrings: flightCarriers });

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

    switch (crudArgs.crudAction) {
        case "create":
            const now: Date = new Date();
            const todayString: string = formatDateForInput({ dateObject: now });
            receptionDateInput.value = todayString;

            await rentalCarOptionsHandler({ rentalCarId: crudArgs.rentalCarId });
            break;
        case "update":
            await populateFormInputs({ reservationId: crudArgs.reservationId, carCatalog: carCatalog });
            submitButton.textContent = "変更確定";
            break;
        case "cancel":
            const cancelCommentTextareaRow = (): HTMLDivElement => {
                const rowDiv: HTMLDivElement = document.createElement("div");
                rowDiv.className = "row";

                const colDiv: HTMLDivElement = document.createElement("div");
                colDiv.className = "col";

                const formFloatingDiv: HTMLDivElement = document.createElement("div");
                formFloatingDiv.className = "form-floating";

                const cancelCommentTextarea: HTMLTextAreaElement = document.createElement("textarea");
                cancelCommentTextarea.className = "form-control";
                cancelCommentTextarea.id = "cancel-comment-textarea";

                const label: HTMLLabelElement = document.createElement("label");
                label.textContent = "キャンセル理由";

                formFloatingDiv.append(cancelCommentTextarea, label);
                colDiv.append(formFloatingDiv);
                rowDiv.append(colDiv);

                return rowDiv;
            }
            titleElement.textContent = "キャンセル理由を入力してください";
            submitButton.remove();

            await populateFormInputs({ reservationId: crudArgs.reservationId, carCatalog: carCatalog });
            const inputElements: NodeListOf<HTMLInputElement> = document.querySelectorAll("input");
            inputElements.forEach((inputElement: HTMLInputElement) => {
                inputElement.disabled = true;
            });
            const selectElements: NodeListOf<HTMLSelectElement> = document.querySelectorAll("select");
            selectElements.forEach((selectElement: HTMLSelectElement) => {
                selectElement.disabled = true;
            });
            commentTextArea.disabled = true;

            const newCancelCommentTextareaRow = cancelCommentTextareaRow();
            titleElement.after(newCancelCommentTextareaRow);

            const cancelSubmitButton: HTMLButtonElement = document.createElement("button");
            cancelSubmitButton.className = "btn btn-danger m-1";
            cancelSubmitButton.id = "cancel-submit-button";
            cancelSubmitButton.textContent = "予約キャンセル確定";

            newCancelCommentTextareaRow.after(cancelSubmitButton);

            const hrElement: HTMLHRElement = document.createElement("hr");
            cancelSubmitButton.after(hrElement);

            break;
    }

    submitButton.addEventListener("click", async () => {
        const reservation: Reservation = getSubmitData({ crudArgs: crudArgs });

        switch (crudArgs.crudAction) {
            case "create":
                try {
                    await window.sqlInsert.reservation(reservation);
                } catch (error: unknown) {
                    console.error(`Failed to invoke reservationData: ${error}`);
                }
            case "update":
                try {
                    await window.sqlUpdate.reservation(reservation);
                } catch (error: unknown) {
                    console.error(`Failed to update reservationData: ${error}`)
                }
        }
    }, false);

    const cancelSubmitButton: HTMLButtonElement = document.querySelector("#cancel-submit-button");
    const cancelEventHandler = {
        handleEvent: async () => {
            const reservation: Reservation = getSubmitData({ crudArgs: crudArgs });
            reservation.isCanceled = true;

            const cancelCommentTextarea: HTMLTextAreaElement = document.querySelector("#cancel-comment-textarea");
            const cancelComment: string = cancelCommentTextarea.value;
            reservation.cancelComment = cancelComment;

            try {
                await window.sqlUpdate.reservation(reservation);
            } catch (error: unknown) {
                console.error(error);
            }
        }
    }
    if (cancelSubmitButton) {
        cancelSubmitButton.addEventListener("click", cancelEventHandler, false);
    }
})();