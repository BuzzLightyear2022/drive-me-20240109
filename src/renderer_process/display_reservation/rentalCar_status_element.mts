import { RentalCarStatus } from "../../@types/types";

export class RentalCarStatusElement extends HTMLElement {
    constructor(args: { rentalCarStatus: RentalCarStatus, style: any }) {
        super();

        const { rentalCarStatus, style } = args;

        Object.assign(this.style, style);

        let currentLocation: string;
        switch (rentalCarStatus.currentLocation) {
            case "本店":
                currentLocation = "本";
                break;
            case "空港店":
                currentLocation = "空";
                break;
            case "駅前店":
                currentLocation = "駅";
                break;
            default:
                currentLocation = rentalCarStatus.currentLocation;
        }

        let washState: string;
        switch (rentalCarStatus.washState) {
            case "洗車済み":
                washState = "";
                break;
            case "未洗車":
                washState = "×";
                break;
            default:
                washState = rentalCarStatus.washState;
        }

        if (rentalCarStatus.washState === "貸出中") {
            this.textContent = rentalCarStatus.washState;
        } else {
            this.textContent = currentLocation + washState;
        }

        const contextmenuHandler = {
            handleEvent: () => {
                window.contextmenu.scheduleCell({ rentalCarId: rentalCarStatus.rentalCarId });
            }
        }
        this.addEventListener("contextmenu", contextmenuHandler, false);
    }
}

customElements.define("rental-car-status", RentalCarStatusElement);