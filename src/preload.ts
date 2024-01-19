import { contextBridge, ipcRenderer } from "electron";
import { CarCatalog, VehicleAttributes, Navigations, LicensePlatesData, ReservationData } from "./@types/types";

contextBridge.exposeInMainWorld(
    "serverInfo",
    {
        serverHost: async (): Promise<string> => {
            return await ipcRenderer.invoke("serverInfo:serverHost");
        },
        port: async (): Promise<string> => {
            return await ipcRenderer.invoke("serverInfo:port");
        },
        imageDirectory: async (): Promise<string> => {
            return await ipcRenderer.invoke("serverInfo:imageDirectory");
        }
    }
);

contextBridge.exposeInMainWorld(
    "fetchJson",
    {
        carCatalog: async (): Promise<CarCatalog> => {
            return await ipcRenderer.invoke("fetchJson:carCatalog");
        },
        navigations: async (): Promise<Navigations> => {
            return await ipcRenderer.invoke("fetchJson:navigations");
        }
    }
);

contextBridge.exposeInMainWorld(
    "openWindow",
    {
        vehicleInputWindow: (): void => {
            ipcRenderer.send("openWindow:vehicleInputWindow");
        },
        reservationInputWindow: (): void => {
            ipcRenderer.send("openWindow:reservationInputWindow");
        },
        displayReservationWindow: (): void => {
            ipcRenderer.send("openWindow:displayReservationWindow");
        }
    }
);

contextBridge.exposeInMainWorld(
    "sqlSelect",
    {
        vehicleAttributes: async (): Promise<VehicleAttributes[]> => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributes")
        },
        rentalClasses: async (args: { selectedSmoking: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:rentalClasses", args);
        },
        carModels: async (args: { selectedSmoking: string, selectedRentalClass: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:carModels", args);
        },
        licensePlates: async (args: { selectedSmoking: string, selectedCarModel: string }): Promise<LicensePlatesData> => {
            return await ipcRenderer.invoke("sqlSelect:licensePlates", args);
        },
        reservationData: async (args: { startDate: Date, endDate: Date }) => {
            return await ipcRenderer.invoke("sqlSelect:reservationData", args);
        },
        reservationDataById: async (args: { reservationId: string }) => {
            return await ipcRenderer.invoke("sqlSelect:reservationDataById", args);
        },
        vehicleAttributesById: async (args: { vehicleId: string }) => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributesById", args);
        }
    }
);

contextBridge.exposeInMainWorld(
    "sqlInsert",
    {
        vehicleAttributes: async (vehicleAttributes: VehicleAttributes): Promise<string> => {
            return await ipcRenderer.invoke("sqlInsert:vehicleAttributes", vehicleAttributes);
        },
        reservationData: async (reservationData: ReservationData): Promise<string> => {
            return await ipcRenderer.invoke("sqlInsert:reservationData", reservationData);
        }
    }
);

contextBridge.exposeInMainWorld(
    "sqlUpdate",
    {
        reservationData: async (reservationData: ReservationData): Promise<void> => {
            ipcRenderer.send("sqlUpdate:reservationData", reservationData);
        },
        vehicleAttributes: async (vehicleAttributes: VehicleAttributes): Promise<void> => {
            ipcRenderer.send("sqlUpdate:vehicleAttributes", vehicleAttributes);
        }
    }
);

contextBridge.exposeInMainWorld(
    "contextMenu",
    {
        scheduleBar: async (reservationId: string) => {
            ipcRenderer.send("contextMenu:schedule-bar", reservationId);
        },
        vehicleAttributesItem: async (args: { vehicleId: string }) => {
            ipcRenderer.send("contextMenu:vehicleAttributesItem", args);
        },
        getReservationId: (callback: (reservationId: string) => void) => ipcRenderer.on("contextMenu:getReservationId", (event: Electron.IpcRendererEvent, reservationId: string) => callback(reservationId)),
        getVehicleId: (callback: (vehicleId: string) => void) => ipcRenderer.on("contextMenu:getVehicleId", (event: Electron.IpcRendererEvent, vehicleId) => callback(vehicleId)),
        updateReservationData: (callback: () => void) => {
            ipcRenderer.on("sqlUpdate:reservationData", () => {
                return callback();
            });
        },
        updateVehicleAttributes: (callback: () => void) => {
            ipcRenderer.on("sqlUpdate:vehicleAttributes", () => {
                return callback();
            });
        }
    }
);

contextBridge.exposeInMainWorld(
    "dialog",
    {
        openFile: async () => ipcRenderer.invoke("dialog:openFile")
    }
);