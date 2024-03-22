import { defineConfig } from 'vite';
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main_window: path.join(__dirname, "index.html"),
                display_reservation_window: path.join(__dirname, "html", "display_reservation.html"),
                edit_reservation_window: path.join(__dirname, "html", "edit_reservation.html"),
                insert_reservation_window: path.join(__dirname, "html", "insert_reservation.html"),
                insert_vehicleAttributes_window: path.join(__dirname, "html", "insert_vehicleAttributes.html"),
                edit_vehicleAttributes_widnow: path.join(__dirname, "html", "edit_vehicleAttributes.html"),
                insert_vehicle_status_window: path.join(__dirname, "html", "insert_vehicle_status.html")
            }
        }
    }
});
