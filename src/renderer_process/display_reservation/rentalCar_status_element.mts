import { RentalCarStatus } from "../../@types/types";

const visualScheduleContainer: HTMLDivElement = document.querySelector("#visual-schedule-container");

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

        this.textContent = currentLocation + washState;
    }
}

customElements.define("rental-car-status", RentalCarStatusElement);