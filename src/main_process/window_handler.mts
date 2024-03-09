import { BrowserWindow, ipcMain, Menu } from "electron";
import path from "path";
import { Windows } from "../@types/types";
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
        editReservationWindow: undefined,
        editVehicleAttributesWindow: undefined,
        editCarCatalogWindow: undefined
    };

    static createLoginWindow = () => {
        const loginWindow: BrowserWindow = new BrowserWindow(
            {
                width: 300,
                height: 200,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
                autoHideMenuBar: true,
                resizable: false
            }
        );

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
            const win: BrowserWindow = new BrowserWindow({
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
            });

            win.on("closed", () => {
                WindowHandler.windows.insertVehicleAttributesWindow = undefined;
            });

            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "ファイル"
                },
                {
                    label: "編集",
                    submenu: [
                        {
                            label: "車両カタログ編集",
                            click: async () => {
                                WindowHandler.createEditCarCatalogWindow();
                            }
                        }
                    ]
                }
            ]);

            Menu.setApplicationMenu(menuTemplate);

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/insert_vehicleAttributes.html`);
                WindowHandler.windows.insertVehicleAttributesWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/insert_vehicleAttributes.html`));
                WindowHandler.windows.insertVehicleAttributesWindow = win;
            }

            win.maximize();
        } else {
            console.log("window is already created");
        }
    }

    static createInsertReservationWindow = (): void => {
        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            },
        });

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/insert_reservation.html`);
            WindowHandler.windows.insertReservationWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/insert_reservation.html`));
            WindowHandler.windows.insertReservationWindow = win;
        }
    }

    static createEditReservationWindow = (reservationId: string): void => {
        if (!WindowHandler.windows.editReservationWindow) {
            const win: BrowserWindow = new BrowserWindow({
                width: 1000,
                height: 800,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/edit_reservation.html`);
                WindowHandler.windows.editReservationWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/edit_reservation.html`));
                WindowHandler.windows.editReservationWindow = win;
            }

            WindowHandler.windows.editReservationWindow.webContents.on("dom-ready", () => {
                WindowHandler.windows.editReservationWindow.webContents.send("contextMenu:getReservationId", reservationId);
            });

            win.on("closed", () => {
                WindowHandler.windows.editReservationWindow = undefined;
            });
        }
    }

    static createDisplayReservationWindow = (args: { accessToken: string }) => {
        const { accessToken } = args;

        const win: BrowserWindow = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                preload: WindowHandler.preloadScript
            },
        });

        win.webContents.openDevTools();

        const menuTemplate = Menu.buildFromTemplate([
            {
                label: "ファイル"
            },
            {
                label: "編集"
            },
            {
                label: "車両管理",
                submenu: [
                    {
                        label: "車両追加",
                        click: async () => {
                            WindowHandler.createInsertVehicleAttributesWindow();
                        }
                    }
                ]
            }
        ]);

        Menu.setApplicationMenu(menuTemplate);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ipcMain.on("contextMenu:schedule-bar", (event: Electron.IpcMainEvent, reservationId: string) => {
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: "変更",
                    click: async () => {
                        WindowHandler.createEditReservationWindow(reservationId);
                    }
                },
                {
                    label: "キャンセル",
                    click: () => {
                        // console.log("cancel", reservationId);
                    }
                }
            ]);
            contextMenu.popup(WindowHandler.windows.displayReservationWindow);
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ipcMain.on("contextMenu:vehicleAttributesItem", (event: Electron.IpcMainEvent, vehicleId: string) => {
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: "車両情報更新",
                    click: async () => {
                        WindowHandler.createEditVehicleAttributesWindow({ accessToken: accessToken, vehicleId: vehicleId });
                    }
                },
                {
                    label: "車両削除",
                    click: () => {
                        console.log("remove vehicle");
                    }
                }
            ]);
            contextMenu.popup(WindowHandler.windows.displayReservationWindow);
        });

        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/display_reservation.html`);
            WindowHandler.windows.displayReservationWindow = win;
        } else {
            win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/display_reservation.html`));
            WindowHandler.windows.displayReservationWindow = win;
        }

        WindowHandler.windows.displayReservationWindow.webContents.on("dom-ready", () => {
            WindowHandler.windows.displayReservationWindow.webContents.send("accessToken:getAccessToken", accessToken);
        });

        win.maximize();
    }

    static createEditVehicleAttributesWindow = (args: { accessToken: string, vehicleId: string }): void => {
        const { accessToken, vehicleId } = args;
        if (!WindowHandler.windows.editVehicleAttributesWindow) {
            const win: BrowserWindow = new BrowserWindow({
                width: 1000,
                height: 800,
                webPreferences: {
                    preload: WindowHandler.preloadScript
                },
            });

            if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
                win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/html/edit_vehicleAttributes.html`);
                WindowHandler.windows.editVehicleAttributesWindow = win;
            } else {
                win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/html/edit_vehicleAttributes.html`));
                WindowHandler.windows.editVehicleAttributesWindow = win;
            }

            WindowHandler.windows.editVehicleAttributesWindow.webContents.on("dom-ready", () => {
                WindowHandler.windows.editVehicleAttributesWindow.webContents.send("contextMenu:getVehicleId", accessToken, vehicleId);
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
                },
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
}