import { ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";

(async () => {
    ipcMain.handle("dialog:openFile", async (event: Electron.IpcMainInvokeEvent) => {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
            filters: [
                {
                    name: "Images",
                    extensions: ["jpg", "jpeg", "png", "gif"]
                }
            ]
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const selectedFilePath = result.filePaths[0];
            const fileExtension = path.extname(selectedFilePath);

            try {
                const fileData = fs.readFileSync(selectedFilePath, { encoding: "base64" });
                const imageDataUrl = `data:image/${fileExtension};base64,${fileData}`;
                return imageDataUrl;
            } catch (error: unknown) {
                console.error(error);
            }
        } else {
            event.sender.send("dialog:openFileCancelled");
        }
    });
})();