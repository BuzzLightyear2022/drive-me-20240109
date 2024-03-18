import { loadImage } from "../common_modules.mjs";
import { VehicleAttributes } from "../../@types/types";

export type VehicleItemType = InstanceType<typeof VehicleItem>;

export const VehicleItem = class {
    static instances: VehicleItemType[] = [];

    vehicleAttributes: VehicleAttributes;
    vehicleItem: HTMLDivElement;

    constructor(vehicleAttributes: VehicleAttributes) {
        this.vehicleAttributes = vehicleAttributes;
        VehicleItem.instances.push(this);
    }

    createVehicleItem = async (): Promise<void> => {
        this.vehicleItem = document.createElement("div");
        this.vehicleItem.className = "vehicle-item"
        this.vehicleItem.setAttribute("data-vehicle-id", String(this.vehicleAttributes.id));
        Object.assign(this.vehicleItem.style, {
            display: "flex",
            flexDirection: "row",
            minWidth: "300px",
            height: "130px",
            border: "solid",
            borderWidth: "1px",
            marginTop: "-1px",
            whiteSpace: "nowrap",
            alignItems: "center",
            lineHeight: "200%",
            cursor: "normal",
            userSelect: "none"
        });

        const ImageDiv = async (fileName: string | null): Promise<HTMLDivElement> => {
            const ImageDiv = (): HTMLDivElement => {
                const imageDiv: HTMLDivElement = document.createElement("div");
                Object.assign(imageDiv.style, {
                    display: "flex",
                    margin: "2px"
                });

                return imageDiv;
            }

            const ImgElement = await loadImage({
                fileName: fileName,
                width: "150px",
                height: "150px"
            });

            const imageDiv: HTMLDivElement = ImageDiv();
            const imgElement: HTMLImageElement = ImgElement;

            imgElement.addEventListener("dragstart", (event: MouseEvent) => {
                event.preventDefault();
            }, false);

            imageDiv.append(imgElement);

            return imageDiv;
        }

        const TextDiv = (): HTMLDivElement => {
            const textDiv: HTMLDivElement = document.createElement("div");
            Object.assign(textDiv.style, {
                display: "flex",
                flexDirection: "column",
                whiteSpace: "nowrap",
                overflow: "hidden"
            });

            const carModelDiv: HTMLDivElement = document.createElement("div");
            carModelDiv.textContent = this.vehicleAttributes.carModel;

            const licensePlateDiv: HTMLDivElement = document.createElement("div");
            const licensePlateString = `${this.vehicleAttributes.licensePlateRegion} ${this.vehicleAttributes.licensePlateCode} ${this.vehicleAttributes.licensePlateHiragana} ${this.vehicleAttributes.licensePlateNumber}`;
            licensePlateDiv.textContent = licensePlateString;

            const nonSmokingDiv: HTMLDivElement = document.createElement("div");
            nonSmokingDiv.textContent = this.vehicleAttributes.nonSmoking ? "禁煙車" : "喫煙車";

            const insurancePriorityDiv: HTMLDivElement = document.createElement("div");
            insurancePriorityDiv.textContent = this.vehicleAttributes.insurancePriority ? "損保優先" : "一般貸出優先";

            textDiv.append(carModelDiv, licensePlateDiv, nonSmokingDiv, insurancePriorityDiv);

            return textDiv;
        }

        const imageDiv: HTMLDivElement = await ImageDiv(this.vehicleAttributes.imageFileName);
        const textDiv: HTMLDivElement = TextDiv();

        this.vehicleItem.append(imageDiv, textDiv);

        this.vehicleItem.addEventListener("contextmenu", () => {
            window.contextmenu.vehicleAttributesItem(this.vehicleAttributes.id);
        }, false);
    }
}