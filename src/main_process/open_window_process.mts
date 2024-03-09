import { ipcMain } from "electron";
import { WindowHandler } from "./window_handler.mjs";

(async () => {
    ipcMain.on("openWindow:vehicleInputWindow", (): void => {
        WindowHandler.createInsertVehicleAttributesWindow();
    });
})();

(async () => {
    ipcMain.on("openWindow:reservationInputWindow", (): void => {
        WindowHandler.createInsertReservationWindow();
    });
})();

(async () => {
    ipcMain.on("openWindow:editCarCatalogWindow", (): void => {
        WindowHandler.createEditCarCatalogWindow();
    });
})();