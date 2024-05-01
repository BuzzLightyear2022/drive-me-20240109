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
                        label: "新規予約",
                        click: () => WindowHandler.createHandleReservationWindow({ crudAction: "create" })
                    },
                    {
                        label: "予約一覧"
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
                        label: "車両一覧"
                    },
                    {
                        label: "車両新規登録",
                        click: () => WindowHandler.createInsertVehicleAttributesWindow()
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
        ipcMain.on("contextmenu:schedule-cell", (event: Electron.IpcMainEvent, rentalCarId: string) => {
            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "ステータス",
                    click: async () => {
                        WindowHandler.createInsertVehicleStatusWindow(rentalCarId);
                    }
                },
                {
                    label: "新規予約",
                    click: async () => {
                        WindowHandler.createHandleReservationWindow({ rentalCarId: rentalCarId, crudAction: "create" });
                    },
                },
                {
                    label: "点検修理",
                    click: async () => {

                    }
                }
            ]);

            menuTemplate.popup(WindowHandler.windows.displayReservationWindow);
        });
    }

    static displayScheduleBarMenu = () => {
        ipcMain.on("contextmenu:schedule-bar", (event: Electron.IpcMainEvent, reservationId: string) => {
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: "予約変更",
                    click: async () => WindowHandler.createHandleReservationWindow({ reservationId: reservationId, crudAction: "update" })
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
    }

    static displayVehicleItemMenu = () => {
        ipcMain.on("contextmenu:vehicleAttributesItem", (event: Electron.IpcMainEvent, vehicleId: string) => {
            const menuTemplate = Menu.buildFromTemplate([
                {
                    label: "ステータス",
                    click: async () => {
                        WindowHandler.createInsertVehicleStatusWindow(vehicleId);
                    }
                },
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