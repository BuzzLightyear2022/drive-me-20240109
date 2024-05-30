import { rentalCarOptionsHandler } from "./common_modules/rentalCar_options_handler.mjs";
import { asyncAppendOptionElements } from "./common_modules/common_modules.mjs";

const receptionBranchSelect: HTMLSelectElement = document.querySelector("#reception-branch-select");

(async () => {
    const crudArgs = await window.contextmenu.getCrudArgs();
    rentalCarOptionsHandler({ rentalCarId: crudArgs.rentalCarId });

    const selectOptions: any = await window.fetchJson.selectOptions();
    const branches: any = selectOptions.branches;
    const branchesArray: string[] = Object.keys(branches);

    await asyncAppendOptionElements({ selectElement: receptionBranchSelect, appendedOptionStrings: branchesArray });
})();