import { app, ipcMain, dialog } from "electron";
import FormData from "form-data";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import path from "path";
import { WindowHandler } from "./window_handler.mjs";
import { WebSocketHandler } from "./websocket_handler.mjs";
import { SqlSelectProcess } from "./sql_select_process.mjs";
import { VehicleAttributes, CarCatalog, ReservationData } from "../@types/types";
import dotenv from "dotenv";
dotenv.config();

const bcrypt = require("bcrypt");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const makeImageFileName = (vehicleAttributes: VehicleAttributes): string => {
    const carModel: string = vehicleAttributes.carModel;
    const licensePlateNumber: string = vehicleAttributes.licensePlateNumber;
    const modelCode: string = vehicleAttributes.modelCode;
    const timestamp: number = new Date().getTime();
    const imageFileName = `${carModel}${licensePlateNumber}${modelCode}${timestamp}.jpeg`;
    return imageFileName;
}

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST as string;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT as string;
// @ts-ignore
const imageDirectory: string = import.meta.env.VITE_IMAGE_DIRECTORY as string;

app.on("ready", WindowHandler.createLoginWindow);

SqlSelectProcess.selectVehicleAttributes();
SqlSelectProcess.selectVehicleAttributesById();
SqlSelectProcess.selectVehicleAttributesByRentalClass();
SqlSelectProcess.selectRentalClasses()
SqlSelectProcess.selectCarModels();
SqlSelectProcess.selectLicensePlates();
SqlSelectProcess.selectReservationData();
SqlSelectProcess.selectReservationDataById();

ipcMain.handle("login:sendUserData", async (event, data) => {
    const serverEndPoint = `https://${serverHost}:${port}/login/getSessionData`;

    const loginData = {
        username: data.username,
        password: data.password
    }

    try {
        const response: AxiosResponse = await axios.post(serverEndPoint, loginData);
        const sessionData = response.data;
        if (sessionData && sessionData.token) {
            WindowHandler.createDisplayReservationWindow();
            WindowHandler.windows.loginWindow.close();
            WindowHandler.windows.loginWindow = undefined;
        } else {
            // login failed process goes on.
        }
    } catch (error: unknown) {
        console.error(error);
    }

});

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

ipcMain.on("openWindow:editCarCatalogWindow", (): void => {
    WindowHandler.createEditCarCatalogWindow();
});

ipcMain.handle("fetchJson:carCatalog", async (): Promise<CarCatalog | unknown> => {
    const serverEndPoint = `https://${serverHost}:${port}/fetchJson/carCatalog`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint);
        return response.data;
    } catch (error: unknown) {
        return error;
    }
});

ipcMain.handle("fetchJson:navigations", async (): Promise<JSON | unknown> => {
    const serverEndPoint = `https://${serverHost}:${port}/fetchJson/navigations`;
    try {
        const response: AxiosResponse = await axios.post(serverEndPoint);
        return response.data;
    } catch (error: unknown) {
        return error;
    }
});

ipcMain.handle("sqlInsert:vehicleAttributes", async (event: Electron.IpcMainInvokeEvent, vehicleAttributes: VehicleAttributes): Promise<string | unknown> => {
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
                ...postData.getHeaders()
            }
        });

        return response.status;
    } catch (error: unknown) {
        return "Failed to send image data: " + error;
    }
});

ipcMain.on("sqlUpdate:vehicleAttributes", async (event: Electron.IpcMainInvokeEvent, vehicleAttributes: VehicleAttributes) => {
    const serverEndPoint = `https://${serverHost}:${port}/sqlUpdate/vehicleAttributes`;

    const postData: FormData = new FormData();

    const imageFileName: string = makeImageFileName(vehicleAttributes);
    if (imageFileName) {
        const imageUrl: string | null = vehicleAttributes.imageFileName;
        if (imageUrl) {
            const base64Image: string = imageUrl.split(";base64").pop();
            const bufferImage: Buffer = Buffer.from(base64Image, "base64");
            postData.append("imageUrl", bufferImage, imageFileName);
        }
    }

    const textData: {
        [key in keyof VehicleAttributes]:
        | string
        | number
        | boolean
        | Date
        | null
    } = {} as {
        [key in keyof VehicleAttributes]:
        | string
        | number
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
                ...postData.getHeaders()
            }
        });

        return response.status;
    } catch (error: unknown) {
        return "Failed to send vehicleAttributes data: " + error;
    }
});

ipcMain.handle("sqlInsert:reservationData", async (event: Electron.IpcMainInvokeEvent, data: ReservationData) => {
    const serverEndPoint = `https://${serverHost}:${port}/sqlInsert/reservationData`;

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
    const serverEndPoint = `https://${serverHost}:${port}/sqlUpdate/reservationData`;

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

ipcMain.handle("dialog:openFile", async (event: Electron.IpcMainInvokeEvent) => {
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
    } else {
        event.sender.send("dialog:openFileCancelled");
    }
});

// const webSocket = new WebSocketHandler();