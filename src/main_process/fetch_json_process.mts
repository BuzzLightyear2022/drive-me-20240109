import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import { CarCatalog } from "../@types/types";
import { accessToken } from "./login_process.mjs"
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT;

(async () => {
    ipcMain.handle("fetchJson:carCatalog", async (event: Electron.IpcMainEvent): Promise<CarCatalog | unknown> => {
        const serverEndPoint = `https://${serverHost}:${port}/fetchJson/carCatalog`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, null, {
                headers: {
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            return error;
        }
    });
})();

(async () => {
    ipcMain.handle("fetchJson:navigations", async (event: Electron.IpcMainEvent): Promise<JSON | unknown> => {
        const serverEndPoint = `https://${serverHost}:${port}/fetchJson/navigations`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, null, {
                headers: {
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            return error;
        }
    });
})();

(async () => {
    ipcMain.handle("fetchJson:carLocation", async (event: Electron.IpcMainEvent): Promise<JSON | unknown> => {
        const serverEndPoint = `https://${serverHost}:${port}/fetchJson/carLocation`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, null, {
                headers: {
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            return error;
        }
    });
})();