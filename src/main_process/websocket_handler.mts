import { WindowHandler } from "./window_handler.mjs";
import dotenv from "dotenv";
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebSocket = require("ws");

// @ts-ignore
const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST as string;
// @ts-ignore
const port: string = import.meta.env.VITE_HTTPS_PORT as string;

export class WebSocketHandler {
    socket;

    constructor() {
        this.socket = new WebSocket(`wss://${serverHost}:${port}`);

        this.socket.on("open", () => {
            console.log("WebSocket connection established");
        });

        this.socket.addEventListener("message", this.handleMessage, false);
    }

    handleMessage = async (event: MessageEvent) => {
        await WindowHandler.windows.displayReservationWindow.send(event.data);
    }
}