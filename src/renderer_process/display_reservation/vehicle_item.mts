import { VehicleAttributes } from "../../@types/types";
import NoImagePng from "../../assets/NoImage.png";

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
        Object.assign(this.vehicleItem.style, {
            display: "flex",
            flexDirection: "row",
            minWidth: "300px",
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
            const serverHost: string = await window.serverInfo.serverHost();
            const port: string = await window.serverInfo.port();
            const imageDirectory: string = await window.serverInfo.imageDirectory();

            const ImageDiv = (): HTMLDivElement => {
                const imageDiv: HTMLDivElement = document.createElement("div");
                Object.assign(imageDiv.style, {
                    display: "flex",
                    margin: "2px"
                });

                return imageDiv;
            }

            const ImgElement = (): HTMLImageElement => {
                const imgElement: HTMLImageElement = new Image();
                Object.assign(imgElement.style, {
                    objectFit: "contain",
                    width: "130px",
                    height: "130px",
                });

                imgElement.onerror = () => {
                    imgElement.src = NoImagePng;
                }

                if (fileName) {
                    imgElement.src = `http://${serverHost}:${port}/${imageDirectory}/${fileName}`;
                    return imgElement;
                } else {
                    imgElement.src = NoImagePng;
                    return imgElement;
                }
            }

            const imageDiv: HTMLDivElement = ImageDiv();
            const imgElement: HTMLImageElement = ImgElement();

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
            console.log(this.vehicleAttributes.id);
            window.contextMenu.vehicleAttributesItem(this.vehicleAttributes.id);
        }, false);
    }
}