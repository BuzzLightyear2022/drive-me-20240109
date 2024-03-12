import { app, ipcMain } from "electron";
import { WindowHandler } from "./window_handler.mjs";
import "./login_process.mjs";
import "./sql_insert_process.mjs";
import "./sql_select_process.mjs";
import "./sql_update_process.mjs"
import "./fetch_json_process.mjs";
import dotenv from "dotenv";
dotenv.config();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT;
// @ts-ignore
const imageDirectory: string = import.meta.env.VITE_IMAGE_DIRECTORY;

app.on("ready", WindowHandler.createLoginWindow);

ipcMain.handle("serverInfo:serverHost", (): string => {
    return serverHost;
});

ipcMain.handle("serverInfo:port", (): string => {
    return port;
});

ipcMain.handle("serverInfo:imageDirectory", (): string => {
    return imageDirectory;
});