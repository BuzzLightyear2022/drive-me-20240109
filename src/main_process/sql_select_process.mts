import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import { accessToken } from "./login_process.mjs";
dotenv.config();

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT;
// @ts-ignore
const imageDirectory: string = import.meta.env.VITE_IMAGE_DIRECTORY;

(async () => {
    ipcMain.handle("sqlSelect:vehicleAttributes", async (event: Electron.IpcMainEvent) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/vehicleAttributes`;
        try {
            const response: AxiosResponse = await axios.post(serverEndPoint, null, {
                headers: {
                    "Authorization": accessToken
                },
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            return console.error(`Failed to select vehicleAttributes: ${error}`);
        }
    });
})();

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
    ipcMain.handle("sqlSelect:vehicleAttributesByRentalClass", async (event: Electron.IpcMainEvent, args: { rentalClass: string }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/vehicleAttributesByClass`;
        try {
            if (args.rentalClass === "全て") {
                const response: AxiosResponse = await axios.post(serverEndPoint, {
                    rentalClass: null
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": accessToken
                    },
                    withCredentials: true
                });
                return response.data;
            } else {
                const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": accessToken
                    },
                    withCredentials: true
                });
                return response.data;
            }
        } catch (error: unknown) {
            return console.error(`Failed to select vehicleAttributes by class ${error}`);
        }
    });
})();

(async () => {
    ipcMain.handle("sqlSelect:rentalClasses", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/vehicleAttributes/rentalClasses`;
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
    ipcMain.handle("sqlSelect:reservationData/filterByDateRange", async (event: Electron.IpcMainInvokeEvent, args: {
        startDate: Date,
        endDate: Date
    }) => {
        const serverEndPoint = `https://${serverHost}:${port}/sqlSelect/reservationData/filterByDateRange`;

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