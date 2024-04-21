import { RentalCar } from "../../@types/types";
import { loadImage } from "../common_modules.mjs";

export class RentalCarItem extends HTMLElement {
    constructor(args: { rentalCar: RentalCar }) {
        super();

        const { rentalCar } = args;

        this.setAttribute("id", rentalCar.id);

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "row",
            minWidth: "300px",
            minHeight: "130px",
            border: "solid",
            borderWidth: "1px",
            marginTop: "-1px",
            whiteSpace: "nowrap",
            alignItems: "center",
            lineHeight: "200%",
            cursor: "normal",
            userSelect: "none"
        });

        (async () => {
            const imageDiv: HTMLDivElement = await this.imageDiv({ fileName: rentalCar.imageFileName });
            const textDiv: HTMLDivElement = this.textDiv({ rentalCar: rentalCar });

            this.append(imageDiv, textDiv);
        })();
    }

    imageDiv = async (args: { fileName: string | null }): Promise<HTMLDivElement> => {
        const { fileName } = args;

        const outerDivElement: HTMLDivElement = document.createElement("div");
        Object.assign(outerDivElement.style, {
            display: "flex",
            margin: "2px"
        });

        const imageElement: HTMLImageElement = await loadImage({
            fileName: fileName,
            width: "150px",
            height: "150px"
        });

        imageElement.addEventListener("dragstart", (event: MouseEvent) => {
            event.preventDefault();
        }, false);

        outerDivElement.append(imageElement);

        return outerDivElement;
    }

    textDiv = (args: { rentalCar: RentalCar }) => {
        const { rentalCar } = args;

        const outerDivElement: HTMLDivElement = document.createElement("div");
        Object.assign(outerDivElement.style, {
            display: "flex",
            flexDirection: "column",
            whiteSpace: "nowrap",
            overflow: "hidden"
        });

        const carModelDiv: HTMLDivElement = document.createElement("div");
        carModelDiv.textContent = rentalCar.carModel;

        const licensePlateDiv: HTMLDivElement = document.createElement("div");
        const licensePlateString = `${rentalCar.licensePlateRegion} ${rentalCar.licensePlateCode} ${rentalCar.licensePlateHiragana} ${rentalCar.licensePlateNumber}`;
        licensePlateDiv.textContent = licensePlateString;

        const nonSmokingDiv: HTMLDivElement = document.createElement("div");
        nonSmokingDiv.textContent = rentalCar.nonSmoking ? "禁煙車" : "喫煙車";

        const insurancePriorityDiv: HTMLDivElement = document.createElement("div");
        insurancePriorityDiv.textContent = rentalCar.insurancePriority ? "損保優先" : "一般貸出優先";

        outerDivElement.append(carModelDiv, licensePlateDiv, nonSmokingDiv, insurancePriorityDiv);

        return outerDivElement;
    }
}

customElements.define("rental-car-item", RentalCarItem);