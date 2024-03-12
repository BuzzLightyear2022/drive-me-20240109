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
        navigations: async (accessToken: string): Promise<Navigations> => {
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
        vehicleAttributes: async (): Promise<VehicleAttributes[]> => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributes")
        },
        vehicleAttributesByRentalClass: async (args: { rentalClass: string }): Promise<VehicleAttributes[]> => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributesByRentalClass", args);
        },
        rentalClasses: async (args: { selectedSmoking?: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:rentalClasses", args);
        },
        carModels: async (args: { selectedSmoking: string, selectedRentalClass: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:carModels", args);
        },
        licensePlates: async (args: { selectedSmoking: string, selectedCarModel: string }): Promise<LicensePlatesData> => {
            return await ipcRenderer.invoke("sqlSelect:licensePlates", args);
        },
        reservationData: async (args: { startDate: Date, endDate: Date }) => {
            return await ipcRenderer.invoke("sqlSelect:reservationData/filterByDateRange", args);
        },
        reservationDataById: async (args: { reservationId: string }) => {
            return await ipcRenderer.invoke("sqlSelect:reservationDataById", args);
        },
        vehicleAttributesById: async (vehicleId: string) => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributesById", vehicleId);
        }
    }
);

contextBridge.exposeInMainWorld(
    "sqlInsert",
    {
        vehicleAttributes: async (args: { vehicleAttributes: VehicleAttributes }): Promise<string> => {
            return await ipcRenderer.invoke("sqlInsert:vehicleAttributes", args);
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
        vehicleAttributes: async (args: { vehicleAttributes: VehicleAttributes }): Promise<void> => {
            ipcRenderer.send("sqlUpdate:vehicleAttributes", args);
        }
    }
);

contextBridge.exposeInMainWorld(
    "contextmenu",
    {
        scheduleBar: async (reservationId: number) => {
            ipcRenderer.send("contextmenu:schedule-bar", reservationId);
        },
        vehicleAttributesItem: async (vehicleId: number) => {
            ipcRenderer.send("contextmenu:vehicleAttributesItem", vehicleId);
        },
        scheduleCell: async (vehicleId: number) => {
            ipcRenderer.send("contextmenu:schedule-cell", vehicleId)
        },
        getReservationId: (callback: (reservationId: string) => void) => ipcRenderer.on("contextmenu:getReservationId", (event: Electron.IpcRendererEvent, reservationId: string) => callback(reservationId)),
        getVehicleId: async () => {
            return new Promise((resolve, reject) => {
                ipcRenderer.on("contextmenu:getVehicleId", (event: Electron.IpcRendererEvent, vehicleId: number) => {
                    if (vehicleId) {
                        resolve(vehicleId);
                    } else {
                        resolve(null);
                    }
                });
            });
        }

    }
);

contextBridge.exposeInMainWorld(
    "webSocket",
    {
        updateReservationData: (callback: () => void): number => {
            const eventId: number = generateUniqueId();
            const eventName: string = "wssUpdate:reservationData";

            const listener = () => {
                callback();
            }

            ipcRenderer.on(eventName, listener);

            wsReservationUpdateListeners[eventId] = {
                event: eventName,
                listener: listener
            };

            return eventId;
        },
        updateVehicleAttributes: (callback: () => void) => {
            const eventId: number = generateUniqueId();
            const eventName: string = "wssUpdate:vehicleAttributes";

            const listener = () => {
                callback();
            }

            ipcRenderer.on(eventName, () => {
                return callback();
            });

            wsVehicleAttributesUpdateListeners[eventId] = {
                event: eventName,
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
        get: async () => {
            return new Promise((resolve, reject) => {
                ipcRenderer.on("accessToken", (event, accessToken) => {
                    if (accessToken) {
                        resolve(accessToken);
                    } else {
                        reject(new Error("Access token not available."));
                    }
                })
            });
        }
    }
);