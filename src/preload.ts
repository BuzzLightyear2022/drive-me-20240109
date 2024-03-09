import { contextBridge, ipcRenderer } from "electron";
import { CarCatalog, VehicleAttributes, Navigations, LicensePlatesData, ReservationData } from "./@types/types";
import { generateUniqueId } from "./renderer_process/common_modules.mjs";

const wsReservationUpdateListeners: any[] = [];
const wsVehicleAttributesUpdateListeners: any[] = [];

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
    "login", {
    getSessionData: async (args: { username: string, password: string }) => {
        return await ipcRenderer.invoke("login:getSessionData", args);
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
        },
        editCarCatalogWindow: (): void => {
            ipcRenderer.send("openWindow:editCarCatalogWindow");
        }
    }
);

contextBridge.exposeInMainWorld(
    "sqlSelect",
    {
        vehicleAttributes: async (args: { accessToken: string }): Promise<VehicleAttributes[]> => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributes")
        },
        vehicleAttributesByRentalClass: async (accessToken: string, args: { rentalClass: string }): Promise<VehicleAttributes[]> => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributesByRentalClass", accessToken, args);
        },
        rentalClasses: async (accessToken: string, args: { selectedSmoking: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:rentalClasses", accessToken, args);
        },
        carModels: async (args: { selectedSmoking: string, selectedRentalClass: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:carModels", args);
        },
        licensePlates: async (args: { selectedSmoking: string, selectedCarModel: string }): Promise<LicensePlatesData> => {
            return await ipcRenderer.invoke("sqlSelect:licensePlates", args);
        },
        reservationData: async (accessToken: string, args: { startDate: Date, endDate: Date }) => {
            return await ipcRenderer.invoke("sqlSelect:reservationData/filterByDateRange", args);
        },
        reservationDataById: async (args: { reservationId: string }) => {
            return await ipcRenderer.invoke("sqlSelect:reservationDataById", args);
        },
        vehicleAttributesById: async (accessToken: string, vehicleId: string) => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributesById", accessToken, vehicleId);
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
        vehicleAttributesItem: async (vehicleId: string) => {
            ipcRenderer.send("contextMenu:vehicleAttributesItem", vehicleId);
        },
        getReservationId: (callback: (reservationId: string) => void) => ipcRenderer.on("contextMenu:getReservationId", (event: Electron.IpcRendererEvent, reservationId: string) => callback(reservationId)),
        getVehicleId: (callback: (accessToken: string, vehicleId: string) => void) => ipcRenderer.on("contextMenu:getVehicleId", (event: Electron.IpcRendererEvent, accessToken: string, vehicleId: string) => callback(accessToken, vehicleId)),
    }
);

contextBridge.exposeInMainWorld(
    "webSocket",
    {
        updateReservationData: (callback: () => void): number => {
            const eventId: number = generateUniqueId();

            const listener = () => {
                callback();
            }

            ipcRenderer.on("wsUpdate:reservationData", listener);

            wsReservationUpdateListeners[eventId] = {
                event: "wsUpdate:reservationData",
                listener: listener
            };

            return eventId;
        },
        updateVehicleAttributes: (callback: () => void) => {
            const eventId: number = generateUniqueId();

            const listener = () => {
                callback();
            }

            ipcRenderer.on("wsUpdate:vehicleAttributes", () => {
                return callback();
            });

            wsVehicleAttributesUpdateListeners[eventId] = {
                event: "wsUpdate:vehicleAttributes",
                listener: listener
            }

            return eventId;
        }
    }
);

contextBridge.exposeInMainWorld(
    "dialog",
    {
        openFile: async () => ipcRenderer.invoke("dialog:openFile"),
        openFileCancelled: async () => ipcRenderer.on("dialog:openFileCancelled", () => true)
    }
);

contextBridge.exposeInMainWorld(
    "removeEvent",
    {
        wsUpdateReservationData: (eventId: number) => {
            const listenerObject = wsReservationUpdateListeners[eventId];

            if (listenerObject) {
                ipcRenderer.removeListener(listenerObject.event, listenerObject.listener);
                delete wsReservationUpdateListeners[eventId];
            }
        }
    }
);

contextBridge.exposeInMainWorld(
    "accessToken",
    {
        getAccessToken: (callback: (accessToken: string) => void) => ipcRenderer.on("accessToken:getAccessToken", (event: Electron.IpcRendererEvent, accessToken: string) => callback(accessToken))
    }
);