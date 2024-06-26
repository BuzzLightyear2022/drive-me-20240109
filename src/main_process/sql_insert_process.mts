import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { VehicleAttributes, ReservationData, VehicleStatus } from "../@types/types";
import { makeImageFileName } from "./common_modules.mjs";
import { accessToken } from "./login_process.mjs";
import { WindowHandler } from "./window_handler.mjs";
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT;

(async () => {
    ipcMain.handle("sqlInsert:vehicleAttributes", async (event: Electron.IpcMainInvokeEvent, args: { vehicleAttributes: VehicleAttributes }): Promise<string | unknown> => {
        const { vehicleAttributes } = args;

        const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/vehicleAttributes`;

        const postData: FormData = new FormData();

        const imageFileName = makeImageFileName(vehicleAttributes);
        const imageUrl: string | undefined = vehicleAttributes.imageFileName;
        if (imageUrl) {
            const base64Image: string = imageUrl.split(";base64").pop() as string;
            const bufferImage: Buffer = Buffer.from(base64Image, "base64");
            postData.append("imageUrl", bufferImage, imageFileName);
        }

        const textData: {
            [key in keyof VehicleAttributes]:
            | number
            | string
            | boolean
            | Date
            | null
        } = {} as {
            [key in keyof VehicleAttributes]:
            | number
            | string
            | boolean
            | Date
            | null
        };

        for (const key in vehicleAttributes) {
            if (key !== "imageFileName") {
                textData[key as keyof VehicleAttributes] = vehicleAttributes[key as keyof VehicleAttributes];
            }
        }

        postData.append("data", JSON.stringify(textData));

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...postData.getHeaders(),
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            WindowHandler.windows.insertVehicleAttributesWindow.close();
            WindowHandler.windows.insertVehicleAttributesWindow = undefined;

            return response.status;
        } catch (error: unknown) {
            return "Failed to send image data: " + error;
        }
    });
})();

(async () => {
    ipcMain.handle("sqlInsert:reservationData", async (event: Electron.IpcMainInvokeEvent, data: ReservationData) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/reservationData`;

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

            // WindowHandler.windows.insertReservationWindow.close();

            return response.status;
        } catch (error: unknown) {
            return `Failed to send reservation data: ${error}`;
        }
    });
})();

(async () => {
    ipcMain.handle("sqlInsert:vehicleStatus", async (event: Electron.IpcMainEvent, args: { vehicleStatus: VehicleStatus }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/vehicleStatus`;

        try {
            WindowHandler.windows.insertVehicleStatusWindow.close();

            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            return response.status;
        } catch (error: unknown) {
            console.error(error);
        }
    });
})()