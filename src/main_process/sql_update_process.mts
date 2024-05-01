import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { makeImageFileName } from "./common_modules.mjs";
import { RentalCar, Reservation } from "../@types/types";
import { accessToken } from "./login_process.mjs";
import { WindowHandler } from "./window_handler.mjs";
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT;

(async () => {
    ipcMain.on("sqlUpdate:vehicleAttributes", async (event: Electron.IpcMainInvokeEvent, args: { rentalCar: RentalCar }) => {
        const { rentalCar } = args;
        const serverEndPoint = `https://${serverHost}:${port}/sqlUpdate/vehicleAttributes`;

        const postData: FormData = new FormData();

        const imageFileName: string = makeImageFileName(rentalCar);
        if (imageFileName) {
            const imageUrl: string | null = rentalCar.imageFileName;
            if (imageUrl) {
                const base64Image: string = imageUrl.split(";base64").pop();
                const bufferImage: Buffer = Buffer.from(base64Image, "base64");
                postData.append("imageUrl", bufferImage, imageFileName);
            }
        }

        const textData: {
            [key in keyof RentalCar]:
            | string
            | number
            | boolean
            | Date
            | null
        } = {} as {
            [key in keyof RentalCar]:
            | string
            | number
            | boolean
            | Date
            | null
        };

        for (const key in rentalCar) {
            if (key !== "imageFileName") {
                textData[key as keyof RentalCar] = rentalCar[key as keyof RentalCar];
            }
        }

        postData.append("data", JSON.stringify(textData));

        try {
            WindowHandler.windows.editVehicleAttributesWindow.close();
            WindowHandler.windows.editVehicleAttributesWindow = undefined;

            const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...postData.getHeaders(),
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            return response.status;
        } catch (error: unknown) {
            console.log("Failed to send vehicleAttributes data: " + error);
        }
    });
})();

(async () => {
    ipcMain.on("sqlUpdate:reservationData", async (event: Electron.IpcMainInvokeEvent, data: Reservation) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlUpdate/reservation`;

        const postData: FormData = new FormData();
        postData.append("data", JSON.stringify(data));

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
                headers: {
                    ...postData.getHeaders(),
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            // WindowHandler.windows.editReservationWindow.close();
            // WindowHandler.windows.editReservationWindow = undefined;

            return response.status;
        } catch (error: unknown) {
            return `Failed to update reservation data ${error}`;
        }
    });
})();