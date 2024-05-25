import { defineConfig } from 'vite';
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main_window: path.join(__dirname, "index.html"),
                display_reservation_window: path.join(__dirname, "html", "display_reservation.html"),
                edit_reservation_window: path.join(__dirname, "html", "handle_reservation.html"),
                loaner_rental_handler_window: path.join(__dirname, "html", "loaner_rental_handler.html"),
                insert_vehicleAttributes_window: path.join(__dirname, "html", "insert_vehicleAttributes.html"),
                edit_vehicleAttributes_widnow: path.join(__dirname, "html", "edit_vehicleAttributes.html"),
                insert_vehicle_status_window: path.join(__dirname, "html", "status_of_rentalCar_handler.html")
            }
        }
    }
});
