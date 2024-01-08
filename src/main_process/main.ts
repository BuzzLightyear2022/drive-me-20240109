import { app, ipcMain, dialog } from "electron";
import FormData from "form-data";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import path from "path";
// import WebSocket from "ws";
import { WindowHandler } from "./window_handler.mjs";
import { VehicleAttributes, CarCatalog, ReservationData } from "../@types/types";
import dotenv from "dotenv";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebSocket = require("ws");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST as string;
// @ts-ignore
const port: string = import.meta.env.VITE_PORT as string;
// @ts-ignore
const imageDirectory: string = import.meta.env.VITE_IMAGE_DIRECTORY as string;

app.on("ready", WindowHandler.createMainWindow);

// const socket = new WebSocket(`ws://${serverHost}:${port}`);
const socket = new WebSocket(`ws://${serverHost}:${port}`);

// app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") {
//         app.quit();
//     }
//     WindowHandler.windows.splice(0, WindowHandler.windows.length);
// });

// app.on("activate", () => {
//     if (!WindowHandler.windows.length) {
//         WindowHandler.createMainWindow();
//     }
// });

ipcMain.handle("serverInfo:serverHost", (): string => {
    return serverHost;
});

ipcMain.handle("serverInfo:port", (): string => {
    return port;
});

ipcMain.handle("serverInfo:imageDirectory", (): string => {
    return imageDirectory;
});

ipcMain.on("openWindow:vehicleInputWindow", (): void => {
    WindowHandler.createInsertVehicleAttributesWindow();
});

ipcMain.on("openWindow:reservationInputWindow", (): void => {
    WindowHandler.createInsertReservationWindow();
});

ipcMain.on("openWindow:displayReservationWindow", (): void => {
    WindowHandler.createDisplayReservationWindow();
});

ipcMain.handle("fetchJson:carCatalog", async (): Promise<CarCatalog | unknown> => {
    const serverEndPoint = `http://${serverHost}:${port}/fetchJson/carCatalog`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint);
        return response.data;
    } catch (error: unknown) {
        return error;
    }
});

ipcMain.handle("fetchJson:navigations", async (): Promise<JSON | unknown> => {
    const serverEndPoint = `http://${serverHost}:${port}/fetchJson/navigations`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint);
        return response.data;
    } catch (error: unknown) {
        return error;
    }
});

ipcMain.handle("sqlSelect:vehicleAttributes", async () => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlSelect/vehicleAttributes`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint);
        return response.data;
    } catch (error: unknown) {
        return console.error(`Failed to select vehicleAttributes: ${error}`);
    }
});

ipcMain.handle("sqlSelect:vehicleAttributesById", async (event: Electron.IpcMainEvent, args: { vehicleId: string }) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlSelect/vehicleAttributesById`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, args);
        return response.data;
    } catch (error: unknown) {
        return console.error(`Failed to select vehicleAttributes by id ${error}`);
    }
});

ipcMain.handle("sqlSelect:rentalClasses", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string }) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlSelect/vehicleAttributes/rentalClasses`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, args);
        return response.data;
    } catch (error: unknown) {
        console.error(`Failed to fetch rentalClasses:, ${error}`);
    }
});

ipcMain.handle("sqlSelect:carModels", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string, selectedRentalClass: string }) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlSelect/vehicleAttributes/carModels`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, args);
        return response.data;
    } catch (error: unknown) {
        console.error(`Failed to fetch carModels: ${error}`);
    }
});

ipcMain.handle("sqlSelect:licensePlates", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string, selectedCarModel: string }) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlSelect/vehicleAttributes/licensePlates`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, args);
        return response.data;
    } catch (error: unknown) {
        console.error(`Failed to fetch licensePlates: ${error}`);
    }
});

ipcMain.handle("sqlSelect:reservationData", async (event: Electron.IpcMainInvokeEvent, args: {
    startDate: Date,
    endDate: Date
}) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlSelect/reservationData/filterByDateRange`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, args);
        return response.data;
    } catch (error: unknown) {
        console.error(`Failed to fetch reservation data: ${error}`);
    }
});

ipcMain.handle("sqlSelect:reservationDataById", async (event: Electron.IpcMainInvokeEvent, args: {
    reservationId: string
}) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlSelect/reservationData/selectById`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, args);
        return response.data;
    } catch (error: unknown) {
        return `Failed to select reservation data by id. ${error}`;
    }
});

ipcMain.handle("sqlInsert:vehicleAttributes", async (event: Electron.IpcMainInvokeEvent, data: VehicleAttributes): Promise<string | unknown> => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlInsert/VehicleAttributes`;
    const formData: VehicleAttributes = data;

    const postData: FormData = new FormData();

    const carModel: string = formData.carModel;
    const licensePlateNumber: string = formData.licensePlateNumber;
    const modelCode: string = formData.modelCode;
    const timestamp: number = new Date().getTime();
    const imageFileName = `${carModel}${licensePlateNumber}${modelCode}${timestamp}.jpeg`;
    const imageUrl: string | undefined = formData.imageFileName;
    if (imageUrl) {
        const base64Image: string = imageUrl.split(";base64").pop() as string;
        const bufferImage: Buffer = Buffer.from(base64Image, "base64");
        postData.append("imageUrl", bufferImage, imageFileName);
    }

    const textData: { [key in keyof VehicleAttributes]: string | boolean | null | undefined } = {} as { [key in keyof VehicleAttributes]: string | boolean | null };
    for (const key in formData) {
        if (key !== "imageFileName") {
            textData[key as keyof VehicleAttributes] = formData[key as keyof VehicleAttributes];
        }
    }

    postData.append("data", JSON.stringify(textData));

    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...postData.getHeaders()
            }
        });

        return response.status;
    } catch (error: unknown) {
        return "Failed to send image data: " + error;
    }
});

ipcMain.handle("sqlInsert:reservationData", async (event: Electron.IpcMainInvokeEvent, data: ReservationData) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlInsert/reservationData`;

    const postData: FormData = new FormData();
    postData.append("data", JSON.stringify(data));

    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
            headers: {
                ...postData.getHeaders()
            }
        });

        return response.status;
    } catch (error: unknown) {
        return `Failed to send reservation data: ${error}`;
    }
});

ipcMain.on("sqlUpdate:reservationData", async (event: Electron.IpcMainInvokeEvent, data: ReservationData) => {
    const serverEndPoint = `http://${serverHost}:${port}/sqlUpdate/reservationData`;

    const postData: FormData = new FormData();
    postData.append("data", JSON.stringify(data));

    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, postData, {
            headers: {
                ...postData.getHeaders()
            }
        });

        return response.status;
    } catch (error: unknown) {
        return `Failed to update reservation data ${error}`;
    }
});

ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            {
                name: "Images",
                extensions: ["jpg", "jpeg", "png", "gif"]
            }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const selectedFilePath = result.filePaths[0];
        const fileExtension = path.extname(selectedFilePath);

        try {
            const fileData = fs.readFileSync(selectedFilePath, { encoding: "base64" });
            const imageDataUrl = `data:image/${fileExtension};base64,${fileData}`;
            return imageDataUrl;
        } catch (error: unknown) {
            console.error(error);
        }
    }
});

socket.on("open", () => {
    console.log("WebSocket connection established");
});

socket.on("message", async () => {
    await WindowHandler.windows.displayReservationWindow.send("sqlUpdate:reservationData");
});

socket.on("close", () => {
    console.log("WebSocket connection closed");
});