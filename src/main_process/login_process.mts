import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import { WindowHandler } from "./window_handler.mjs";
import { connectWebSocket } from "./websocket_handler.mjs";
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT;

(async () => {
    ipcMain.handle("login:getSessionData", async (event, data) => {
        const serverEndPoint = `https://${serverHost}:${port}/login/getSessionData`;

        const loginData = {
            username: data.username,
            password: data.password
        }

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, loginData);
            const sessionData: string = response.data;
            if (sessionData) {
                WindowHandler.createDisplayReservationWindow({ accessToken: sessionData });
                WindowHandler.windows.loginWindow.close();
                WindowHandler.windows.loginWindow = undefined;

                connectWebSocket();
            } else {
                // login failed process goes on.
            }
        } catch (error: unknown) {
            console.error(error);
        }
    });
})();