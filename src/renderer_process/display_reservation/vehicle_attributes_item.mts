import { VehicleAttributes } from "../../@types/types";


import NoImagePng from "../../assets/NoImage.png";

const VehicleAttributesItem = class extends HTMLDivElement {
    constructor(args: { vehicleAttributes: VehicleAttributes }) {
        super();
        const { vehicleAttributes } = args;

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "row",
            whiteSpace: "nowrap",
            alignItems: "center",
            border: "solid",
            borderWidth: "1px",
            width: "300px",
            height: "130px",
            lineHight: "200%",
            cursor: "nomal",
            userSelect: "none",
            marginTop: "-1px"
        });

        (async () => {
            if (vehicleAttributes.imageFileName) {
                const imageDiv: HTMLDivElement = await this.imageDiv(vehicleAttributes.imageFileName);
                this.append(imageDiv);
            } else {
                const imageDiv: HTMLDivElement = await this.imageDiv();
                this.append(imageDiv);
            }
            const textDiv: HTMLDivElement = this.textDiv({ vehicleAttributes });
            this.append(textDiv);
        })();

        this.addEventListener("contextmenu", async () => {
            await window.contextMenu.vehicleAttributesItem({ vehicleId: vehicleAttributes.id });
        }, false);
    }

    private imageDiv = async (fileName?: string): Promise<HTMLDivElement> => {
        const serverHost: string = await window.serverInfo.serverHost();
        const port: string = await window.serverInfo.port();
        const imageDirectory: string = await window.serverInfo.imageDirectory();

        const imageDiv: HTMLDivElement = document.createElement("div");
        Object.assign(imageDiv.style, {
            display: "flex",
            margin: "2px"
        });
        const imgElement: HTMLImageElement = document.createElement("img");

        if (fileName) {
            imgElement.src = `http://${serverHost}:${port}/${imageDirectory}/${fileName}`;
        } else {
            imgElement.src = NoImagePng;
        }

        Object.assign(imgElement.style, {
            objectFit: "contain",
            width: "130px",
            height: "130px",
        });

        imgElement.addEventListener("dragstart", (event: MouseEvent) => {
            event.preventDefault();
        }, false);

        imageDiv.append(imgElement);

        return imageDiv;
    }

    private textDiv = (args: { vehicleAttributes: VehicleAttributes }): HTMLDivElement => {
        const { vehicleAttributes } = args;

        const textDiv: HTMLDivElement = document.createElement("div");
        Object.assign(textDiv.style, {
            display: "flex",
            flexDirection: "column",
            whiteSpace: "nowrap",
            overflow: "hidden"
        });

        const carModelDiv: HTMLDivElement = document.createElement("div");
        carModelDiv.textContent = vehicleAttributes.carModel;

        const licensePlateDiv: HTMLDivElement = document.createElement("div");
        licensePlateDiv.textContent = `${vehicleAttributes.licensePlateRegion} ${vehicleAttributes.licensePlateCode} ${vehicleAttributes.licensePlateHiragana} ${vehicleAttributes.licensePlateNumber}`;

        const modelCodeDiv: HTMLDivElement = document.createElement("div");
        modelCodeDiv.textContent = vehicleAttributes.modelCode;

        const nonSmokingDiv: HTMLDivElement = document.createElement("div");
        nonSmokingDiv.textContent = vehicleAttributes.nonSmoking ? "禁煙車" : "喫煙車";

        const insurancePriorityDiv: HTMLDivElement = document.createElement("div");
        insurancePriorityDiv.textContent = vehicleAttributes.insurancePriority ? "損保優先" : "一般貸出";

        textDiv.append(carModelDiv, licensePlateDiv, modelCodeDiv, nonSmokingDiv, insurancePriorityDiv);

        return textDiv;
    }
}

customElements.define("vehicle-attributes-item-div", VehicleAttributesItem, { extends: "div" });

export { VehicleAttributesItem }