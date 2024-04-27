import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { accessToken } from "./login_process.mjs";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT;

(async () => {
    ipcMain.handle("sqlSelect:vehicleAttributesById", async (event: Electron.IpcMainEvent, args: { vehicleId: string }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/vehicleAttributesById`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            return console.error(`Failed to select vehicleAttributes by id ${error}`);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:rentalCars", async (event: Electron.IpcMainEvent, args: { rentalClass?: string | null }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/rentalCars`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            return console.error(`Failed to select vehicleAttributes by class ${error}`);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:existingRentalClasses", async (event: Electron.IpcMainInvokeEvent, args: { nonSmoking?: string }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/existingRentalClasses`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            return response.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch rentalClasses:, ${error}`);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:carModels", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string, selectedRentalClass: string }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/vehicleAttributes/carModels`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch carModels: ${error}`);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:licensePlates", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string, selectedCarModel: string }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/vehicleAttributes/licensePlates`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch licensePlates: ${error}`);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:reservations", async (event: Electron.IpcMainInvokeEvent, args: {
        startDate?: Date,
        endDate?: Date
    }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/reservations`;

        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });

            return response.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch reservation data: ${error}`);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:reservationDataById", async (event: Electron.IpcMainInvokeEvent, args: {
        reservationId: string
    }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/reservationData/selectById`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            return `Failed to select reservation data by id. ${error}`;
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:latestVehicleStatuses", async (event: Electron.IpcMainInvokeEvent, args: { rentalClass?: string }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/vehicleStatuses/latest`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, args, {
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