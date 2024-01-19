import { CarCatalog, LicensePlatesData, ReservationData, Navigations, VehicleAttributes, VehicleAttributesArray } from "../types";

export interface serverInfo {
    serverHost: () => Promise<string>;
    port: () => Promise<string>;
    imageDirectory: () => Promise<string>;
}

export interface openWindow {
    vehicleInputWindow: () => Promise<void>;
    reservationInputWindow: () => Promise<void>;
    displayReservationWindow: () => Promise<void>;
}

export interface fetchJson {
    carCatalog: () => Promise<CarCatalog>;
    navigations: () => Promise<Navigations>;
}

export interface sqlSelect {
    vehicleAttributes: () => Promise<VehicleAttributesArray>;
    vehicleAttributesById: (args: { vehicleId: string }) => Promise<VehicleAttributes>
    rentalClasses: (args: { selectedSmoking: string }) => Promise<string[]>;
    carModels: (args: { selectedSmoking: string, selectedRentalClass: string }) => Promise<string[]>;
    licensePlates: (args: { selectedSmoking: string, selectedCarModel: string }) => Promise<LicensePlatesData>;
    reservationData: (args: { startDate: Date, endDate: Date }) => Promise<>;
    reservationDataById: (args: { reservationId: string }) => Promise<ReservationData>;
}

export interface sqlInsert {
    vehicleAttributes: (vehicleAttributes: VehicleAttributes) => Promise<string>;
    reservationData: (reservationData: ReservationData) => Promise<string>
}

export interface sqlUpdate {
    reservationData: (reservationData: ReservationData) => Promise<void>;
    vehicleAttributes: (vehicleAttributes: VehicleAttributes) => Promise<void>
}

export interface contextMenu {
    scheduleBar: (reservationId: string) => Promise<void>;
    vehicleAttributesItem: (args: { vehicleId: string }) => Promise<void>;
    getReservationId: (callback) => void;
    getVehicleId: (callback) => void;
    updateReservationData: (callback: () => void) => void;
    updateVehicleAttributes: (callback: () => void) => void;
}

export interface dialog {
    openFile: () => Promise<string>;
}

declare global {
    interface Window {
        serverInfo: serverInfo;
        openWindow: openWindow;
        fetchJson: fetchJson;
        sqlSelect: sqlSelect;
        sqlInsert: sqlInsert;
        sqlUpdate: sqlUpdate
        contextMenu: contextMenu;
        dialog: dialog;
    }
}