import { BrowserWindow, screen } from "electron";
import path from "path";
import { Windows } from "../@types/types";
import { ContextmenuHandler } from "./contextmenu_handler.mjs";
import { accessToken } from "./login_process.mjs";
import dotenv from "dotenv";
dotenv.config();

export class WindowHandler {
    static preloadScript: string = path.join(__dirname, "preload.js");
    static windows: Windows = {
        loginWindow: undefined,
        menuWindow: undefined,
        insertVehicleAttributesWindow: undefined,
        insertReservationWindow: undefined,
        displayReservationWindow: undefined,
        handleReservationWindow: undefined,
        editVehicleAttributesWindow: undefined,
        editCarCatalogWindow: undefined,
        statusOfRentalCarHandlerWindow: undefined
    }

    static createLoginWindow = () => {
        const loginWindow: BrowserWindow = new BrowserWindow(
            {
                width: 300,
                height: 300,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
                resizable: false
            }
        );

        loginWindow.menuBarVisible = false;

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            loginWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
            WindowHandler.windows.loginWindow = loginWindow;
        } else {
            loginWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
            WindowHandler.windows.loginWindow = loginWindow;
        }
    }

    static createMenuWindow = () => {
        const menuWindow: BrowserWindow = new BrowserWindow(
            {
                width: 1000,
                height: 800,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            }
        );

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            menuWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/menu.html`);
            WindowHandler.windows.menuWindow = menuWindow;
        } else {
            menuWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/menu.html`));
            WindowHandler.windows.menuWindow = menuWindow;
        }
    }

    static createInsertVehicleAttributesWindow = (): void => {
        if (!WindowHandler.windows.insertVehicleAttributesWindow) {
            const { height } = screen.getPrimaryDisplay().workAreaSize;

            const win: BrowserWindow = new BrowserWindow({
                width: 800,
                height: height,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
            });

            // win.webContents.openDevTools();

            win.webContents.on("dom-ready", () => {
                win.webContents.send("accessToken", accessToken);
            });

            win.on("closed", () => {
                WindowHandler.windows.insertVehicleAttributesWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/insert_vehicleAttributes.html`);
                WindowHandler.windows.insertVehicleAttributesWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/insert_vehicleAttributes.html`));
                WindowHandler.windows.insertVehicleAttributesWindow = win;
            }
        } else {
            console.log("window is already created");
        }
    }

    static createHandleReservationWindow = (args: { rentalCarId?: string, reservationId?: string, crudAction: string }): void => {
        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            },
        });

        win.webContents.openDevTools();

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/handle_reservation.html`);
            WindowHandler.windows.handleReservationWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/handle_reservation.html`));
            WindowHandler.windows.handleReservationWindow = win;
        }

        win.webContents.on("dom-ready", () => {
            win.webContents.send("contextmenu:getCrudArgs", args);
        });

        win.on("close", () => {
            WindowHandler.windows.handleReservationWindow = undefined;
        });
    }

    static createLoanerRentalHandlerWindow = (args: {}) => {
        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            }
        });

        win.webContents.openDevTools();

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/loaner_rental_handler.html`);
            WindowHandler.windows.handleReservationWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/loaner_rental_handler.html`));
            WindowHandler.windows.handleReservationWindow = win;
        }

        win.webContents.on("dom-ready", () => {
            win.webContents.send("contextmenu:getCrudArgs", args);
        });

        win.on("close", () => {
            WindowHandler.windows.handleReservationWindow = undefined;
        });
    }

    static createDisplayReservationWindow = () => {
        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            },
        });

        win.webContents.openDevTools();

        ContextmenuHandler.displayMenubarMenu();
        ContextmenuHandler.displayScheduleCellMenu();
        ContextmenuHandler.displayScheduleBarMenu();
        ContextmenuHandler.displayVehicleItemMenu();

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/display_reservation.html`);
            WindowHandler.windows.displayReservationWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/display_reservation.html`));
            WindowHandler.windows.displayReservationWindow = win;
        }

        win.maximize();
    }

    static createEditVehicleAttributesWindow = (vehicleId: string): void => {
        const { height } = screen.getPrimaryDisplay().workAreaSize;

        if (!WindowHandler.windows.editVehicleAttributesWindow) {
            const win: BrowserWindow = new BrowserWindow({
                width: 800,
                height: height,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            });

            // win.webContents.openDevTools();

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/edit_vehicleAttributes.html`);
                WindowHandler.windows.editVehicleAttributesWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/edit_vehicleAttributes.html`));
                WindowHandler.windows.editVehicleAttributesWindow = win;
            }

            win.webContents.on("dom-ready", () => {
                win.webContents.send("contextmenu:getVehicleId", vehicleId);
            });

            win.on("closed", () => {
                WindowHandler.windows.editVehicleAttributesWindow = undefined;
            });
        }
    }

    static createEditCarCatalogWindow = (): void => {
        if (!WindowHandler.windows.editCarCatalogWindow) {
            const win: BrowserWindow = new BrowserWindow({
                width: 1000,
                height: 800,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            });

            win.on("closed", () => {
                WindowHandler.windows.editCarCatalogWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/edit_carCatalog.html`);
                WindowHandler.windows.editCarCatalogWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/edit_carCatalog.html`));
                WindowHandler.windows.editCarCatalogWindow = win;
            }
        }
    }

    static createStatusOfRentalCarHandlerWindow = (args: { rentalCarId: string }) => {
        const { rentalCarId } = args;

        if (!WindowHandler.windows.statusOfRentalCarHandlerWindow) {
            const win: BrowserWindow = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                }
            });

            win.webContents.openDevTools();

            win.menuBarVisible = false;

            win.webContents.on("dom-ready", () => {
                win.webContents.send("contextmenu:getRentalCarId", rentalCarId);
            });

            win.on("closed", () => {
                WindowHandler.windows.statusOfRentalCarHandlerWindow = undefined;
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/status_of_rentalCar_handler.html`);
                WindowHandler.windows.statusOfRentalCarHandlerWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/status_of_rentalCar_handler.html`));
                WindowHandler.windows.statusOfRentalCarHandlerWindow = win;
            }
        }
    }
}