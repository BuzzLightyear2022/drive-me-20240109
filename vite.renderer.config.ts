import { defineConfig } from 'vite';
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main_window: path.join(__dirname, "index.html"),
                display_reservation_window: path.join(__dirname, "html", "display_reservation.html")
            }
        }
    }
});
