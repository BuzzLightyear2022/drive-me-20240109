import { appendOptions } from "./common_modules/common_modules.mjs";
import { ReservationData, LicensePlatesData, VehicleAttributes } from "../@types/types";
import { getRadioValue, setRadioValue, convertToSystemTimezone } from "./common_modules/common_modules.mjs";

const isRepliedCheck: HTMLInputElement = document.querySelector("#is-replied-check");
const receptionDateInput: HTMLInputElement = document.querySelector("#reception-date");
const repliedDatetimeInput: HTMLInputElement = document.querySelector("#replied-datetime");
const salesBranchSelect: HTMLSelectElement = document.querySelector("#sales-branch");
const orderHandlerSelect: HTMLSelectElement = document.querySelector("#order-handler");

(async () => {
    const selectOptions: any = await window.fetchJson.selectOptions();
    console.log(selectOptions)

    const branches: any = selectOptions.branches;
    const branchNames: string[] = Object.keys(branches);

    branchNames.forEach((branchName: string) => {
        const option = document.createElement("option");
        option.textContent = `${branchName}(${branches[branchName].phoneNumber})`;
        option.value = branchName;
        salesBranchSelect.append(option);
    });

    const staffMembers: string[] = selectOptions.staffMembers;
    staffMembers.forEach((member: string) => {
        const option = document.createElement("option");
        option.textContent = member;
        option.value = member;
        orderHandlerSelect.append(option);
    });
})();

(async () => {
    const reservationId: number = await window.contextmenu.getReservationId();
    const currentReservationData: ReservationData = await window.sqlSelect.reservationDataById({ reservationId: reservationId })

    isRepliedCheck.checked = currentReservationData.isReplied;
    isRepliedCheck.checked ? repliedDatetimeInput.disabled = false : repliedDatetimeInput.disabled = true;

    receptionDateInput.value = String(currentReservationData.receptionDate);

    if (currentReservationData.repliedDatetime) {
        const systemTimezone: string = await window.systemTimezone.getSystemTimezone();

        const formatter = new Intl.DateTimeFormat("ja-JP", {
            timeZone: systemTimezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

        const formattedRepliedDatetime: string = formatter.format(new Date(currentReservationData.repliedDatetime));
        const formattedDatetimeString: string = formattedRepliedDatetime.replaceAll("/", "-").replace(" ", "T");
        repliedDatetimeInput.value = formattedDatetimeString;
    }

    salesBranchSelect.value = currentReservationData.salesBranch;
    orderHandlerSelect.value = currentReservationData.orderHandler;
})();

isRepliedCheck.addEventListener("change", () => {
    isRepliedCheck.checked ? repliedDatetimeInput.disabled = false : repliedDatetimeInput.disabled = true;
});