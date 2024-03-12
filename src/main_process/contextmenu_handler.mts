import { ipcMain, Menu } from "electron";
import { WindowHandler } from "./window_handler.mjs";

export class ContextmenuHandler {
    static displayMenubarMenu = () => {
        const menuTemplate = Menu.buildFromTemplate([
            {
                label: "ファイル"
            },
            {
                label: "編集"
            },
            {
                label: "予約管理",
                submenu: [
                    {
                        label: "予約変更"
                    },
                    {
                        label: "シミュレーションモード"
                    }
                ]
            },
            {
                label: "車両管理",
                submenu: [
                    {
                        label: "車両新規登録",
                        click: async () => {
                            WindowHandler.createInsertVehicleAttributesWindow();
                        }
                    }
                ]
            },
            {
                label: "表示"
            },
            {
                label: "ヘルプ"
            }
        ]);

        Menu.setApplicationMenu(menuTemplate);
    }

    static displayScheduleCellMenu = () => {
        ipcMain.on("contextmenu:schedule-cell", (event: Electron.IpcMainEvent, vehicleId: number) => {
            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "新規予約",
                    click: async () => {
                        WindowHandler.createInsertReservationWindow(vehicleId);
                    },
                },
                {
                    label: "点検修理",
                    click: async () => {

                    }
                },
                {
                    label: "ステータス",
                    click: async () => {

                    }
                }
            ]);

            menuTemplate.popup(WindowHandler.windows.displayReservationWindow);
        });
    }

    static displayVehicleItemMenu = () => {
        ipcMain.on("contextmenu:vehicleAttributesItem", (event: Electron.IpcMainEvent, vehicleId: number) => {
            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "車両情報更新",
                    click: async () => {
                        WindowHandler.createEditVehicleAttributesWindow(vehicleId);
                    }
                },
                {
                    label: "車両削除",
                    click: () => {
                        console.log("remove vehicle");
                    }
                }
            ]);

            menuTemplate.popup(WindowHandler.windows.displayReservationWindow);
        });
    }
}