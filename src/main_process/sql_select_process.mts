import { ipcMain } from "electron";
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
dotenv.config();

export class SqlSelectProcess {
    // @ts-ignore
    static serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST as string;
    // @ts-ignore
    static port: string = import.meta.env.VITE_HTTPS_PORT as string;
    // @ts-ignore
    static imageDirectory: string = import.meta.env.VITE_IMAGE_DIRECTORY as string;

    static selectVehicleAttributes = () => {
        ipcMain.handle("sqlSelect:vehicleAttributes", async () => {
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/vehicleAttributes`;
            try {
                const response: AxiosResponse = await axios.post(serverEndPoint);
                return response.data;
            } catch (error: unknown) {
                return console.error(`Failed to select vehicleAttributes: ${error}`);
            }
        });
    }

    static selectVehicleAttributesById = () => {
        ipcMain.handle("sqlSelect:vehicleAttributesById", async (event: Electron.IpcMainEvent, args: { vehicleId: string }) => {
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/vehicleAttributesById`;
            try {
                const response: AxiosResponse = await axios.post(serverEndPoint, args);
                return response.data;
            } catch (error: unknown) {
                return console.error(`Failed to select vehicleAttributes by id ${error}`);
            }
        });
    }

    static selectVehicleAttributesByRentalClass = () => {
        ipcMain.handle("sqlSelect:vehicleAttributesByRentalClass", async (event: Electron.IpcMainEvent, args: { accessToken: string, rentalClass: string }) => {
            const { accessToken } = args;
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/vehicleAttributesByClass`;
            try {
                if (args.rentalClass === "全て") {
                    // const response: AxiosResponse = await axios.post(serverEndPoint, {
                    //     rentalClass: null
                    // }, {
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //         "Authorization": accessToken
                    //     },
                    //     withCredentials: true
                    // });

                    const response: AxiosResponse = await axios.post(serverEndPoint, {
                        rentalClass: null
                    });

                    return response.data;
                } else {
                    // const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //         "Authorization": accessToken
                    //     },
                    //     withCredentials: true
                    // });

                    const response: AxiosResponse = await axios.post(serverEndPoint, args);

                    return response.data;
                }
            } catch (error: unknown) {
                return console.error(`Failed to select vehicleAttributes by class ${error}`);
            }
        });
    }

    static selectRentalClasses = () => {
        ipcMain.handle("sqlSelect:rentalClasses", async (event: Electron.IpcMainInvokeEvent, args: { accessToken: string, selectedSmoking: string }) => {
            const { accessToken, selectedSmoking } = args;
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/vehicleAttributes/rentalClasses`;

            try {
                const response: AxiosResponse = await axios.post(serverEndPoint, args, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": accessToken
                    },
                    withCredentials: true
                });

                // const response: AxiosResponse = await axios.post(serverEndPoint, args);

                return response.data;
            } catch (error: unknown) {
                console.error(`Failed to fetch rentalClasses:, ${error}`);
            }
        });
    }

    static selectCarModels = () => {
        ipcMain.handle("sqlSelect:carModels", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string, selectedRentalClass: string }) => {
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/vehicleAttributes/carModels`;
            try {
                const response: AxiosResponse = await axios.post(serverEndPoint, args);
                return response.data;
            } catch (error: unknown) {
                console.error(`Failed to fetch carModels: ${error}`);
            }
        });
    }

    static selectLicensePlates = () => {
        ipcMain.handle("sqlSelect:licensePlates", async (event: Electron.IpcMainInvokeEvent, args: { selectedSmoking: string, selectedCarModel: string }) => {
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/vehicleAttributes/licensePlates`;
            try {
                const response: AxiosResponse = await axios.post(serverEndPoint, args);
                return response.data;
            } catch (error: unknown) {
                console.error(`Failed to fetch licensePlates: ${error}`);
            }
        });
    }

    static selectReservationData = () => {
        ipcMain.handle("sqlSelect:reservationData", async (event: Electron.IpcMainInvokeEvent, args: {
            startDate: Date,
            endDate: Date
        }) => {
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/reservationData/filterByDateRange`;
            try {
                const response: AxiosResponse = await axios.post(serverEndPoint, args);
                return response.data;
            } catch (error: unknown) {
                console.error(`Failed to fetch reservation data: ${error}`);
            }
        });
    }

    static selectReservationDataById = () => {
        ipcMain.handle("sqlSelect:reservationDataById", async (event: Electron.IpcMainInvokeEvent, args: {
            reservationId: string
        }) => {
            const serverEndPoint = `https://${SqlSelectProcess.serverHost}:${SqlSelectProcess.port}/sqlSelect/reservationData/selectById`;
            try {
                const response: AxiosResponse = await axios.post(serverEndPoint, args);
                return response.data;
            } catch (error: unknown) {
                return `Failed to select reservation data by id. ${error}`;
            }
        });
    }
}