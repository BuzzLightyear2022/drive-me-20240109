import { contextBridge, ipcRenderer } from "electron";
import {
    CarCatalog,
    RentalCar,
    Navigations,
    LicensePlate,
    Reservation,
    CarLocation,
    RentalCarStatus
} from "./@types/types";
import { generateUniqueId } from "./renderer_process/common_modules.mjs";

const wsReservationUpdateListeners: any[] = [];
const wsVehicleAttributesUpdateListeners: any[] = [];
const wsVehicleStatusUpdateListeners: any[] = [];

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

contextBridge.exposeInMainWorld("systemTimezone", {
    getSystemTimezone: async (): Promise<string> => {
        return await ipcRenderer.invoke("systemTimezone:getSystemTimezone");
    }
});

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
        },
        carLocation: async (): Promise<CarLocation | unknown> => {
            return await ipcRenderer.invoke("fetchJson:carLocation");
        },
        selectOptions: async () => {
            return await ipcRenderer.invoke("fetchJson:selectOptions");
        }
    }
);

contextBridge.exposeInMainWorld(
    "openWindow",
    {
        vehicleInputWindow: (): void => {
            ipcRenderer.send("openWindow:vehicleInputWindow");
        },
        handleReservationWindow: (): void => {
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
        rentalCars: async (args: { rentalClass?: string | null }): Promise<RentalCar[]> => {
            return await ipcRenderer.invoke("sqlSelect:rentalCars", args);
        },
        existingRentalClasses: async (args: { nonSmoking?: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:existingRentalClasses", args);
        },
        vehicleAttributesByRentalClass: async (args: { rentalClass: string }): Promise<RentalCar[]> => {
            return await ipcRenderer.invoke("sqlSelect:vehicleAttributesByRentalClass", args);
        },
        carModels: async (args: { selectedSmoking?: string, selectedRentalClass: string }): Promise<string[]> => {
            return await ipcRenderer.invoke("sqlSelect:carModels", args);
        },
        licensePlates: async (args: { smoking?: string, carModel: string }): Promise<LicensePlate> => {
            return await ipcRenderer.invoke("sqlSelect:licensePlates", args);
        },
        reservations: async (args: { startDate?: Date, endDate?: Date }) => {
            return await ipcRenderer.invoke("sqlSelect:reservations", args);
        },
        reservationById: async (args: { reservationId: string }) => {
            return await ipcRenderer.invoke("sqlSelect:reservationById", args);
        },
        rentalCarById: async (args: { rentalCarId: string }) => {
            return await ipcRenderer.invoke("sqlSelect:rentalCarById", args);
        },
        latestStatusOfRentalCars: async (args: { rentalClass?: string }) => {
            return await ipcRenderer.invoke("sqlSelect:latestStatusOfRentalCars", args);
        }
    }
);

contextBridge.exposeInMainWorld(
    "sqlInsert",
    {
        rentalCar: async (args: { rentalCar: RentalCar }): Promise<string> => {
            return await ipcRenderer.invoke("sqlInsert:rentalCar", args);
        },
        reservation: async (reservation: Reservation): Promise<string> => {
            return await ipcRenderer.invoke("sqlInsert:reservation", reservation);
        },
        rentalCarStatus: async (args: { rentalCarStatus: RentalCarStatus }) => {
            return await ipcRenderer.invoke("sqlInsert:rentalCarStatus", args);
        }
    }
);

contextBridge.exposeInMainWorld(
    "sqlUpdate",
    {
        reservation: async (reservation: Reservation): Promise<void> => {
            ipcRenderer.send("sqlUpdate:reservation", reservation);
        },
        vehicleAttributes: async (args: { vehicleAttributes: VehicleAttributes }): Promise<void> => {
            ipcRenderer.send("sqlUpdate:vehicleAttributes", args);
        }
    }
);

contextBridge.exposeInMainWorld(
    "contextmenu",
    {
        scheduleBar: async (reservationId: string) => {
            ipcRenderer.send("contextmenu:schedule-bar", reservationId);
        },
        vehicleAttributesItem: async (args: { rentalCarId: string }) => {
            ipcRenderer.send("contextmenu:rentalCarItem", args);
        },
        scheduleCell: async (args: { rentalCarId: string }) => {
            ipcRenderer.send("contextmenu:schedule-cell", args);
        },
        getCrudArgs: async () => {
            return new Promise((resolve, reject) => {
                ipcRenderer.on("contextmenu:getCrudArgs", (event: Electron.IpcRendererEvent, args) => {
                    resolve(args);
                });
            });
        },
        getReservationId: async () => {
            return new Promise((resolve, reject) => {
                ipcRenderer.on("contextmenu:getReservationId", (event: Electron.IpcRendererEvent, reservationId: number) => {
                    if (reservationId) {
                        resolve(reservationId);
                    } else {
                        resolve(null);
                    }
                });
            });
        },
        getRentalCarId: async (): Promise<string> => {
            return new Promise((resolve, reject) => {
                ipcRenderer.on("contextmenu:getRentalCarId", (event: Electron.IpcRendererEvent, rentalCarId: string) => {
                    if (rentalCarId) {
                        resolve(rentalCarId);
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
        },
        updateVehicleStatus: (callback: () => void) => {
            const eventId: number = generateUniqueId();
            const eventName: string = "wssUpdate:vehicleStatus";

            const listener = () => {
                callback();
            }

            ipcRenderer.on(eventName, () => {
                return callback();
            });

            wsVehicleStatusUpdateListeners[eventId] = {
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