import { CarCatalog, LicensePlatesData, ReservationData, Navigations, VehicleAttributes, VehicleAttributesArray } from "../types";

export interface serverInfo {
    serverHost: () => Promise<string>;
    port: () => Promise<string>;
    imageDirectory: () => Promise<string>;
}

export interface login {
    sendUserData: (args: {
        username: string,
        password: string
    }) => Promise<void>;
}

export interface openWindow {
    vehicleInputWindow: () => Promise<void>;
    reservationInputWindow: () => Promise<void>;
    displayReservationWindow: () => Promise<void>;
    editCarCatalogWindow: () => Promise<void>;
}

export interface fetchJson {
    carCatalog: () => Promise<CarCatalog>;
    navigations: () => Promise<Navigations>;
}

export interface sqlSelect {
    vehicleAttributes: () => Promise<VehicleAttributesArray>;
    vehicleAttributesById: (args: { vehicleId: string }) => Promise<VehicleAttributes>;
    vehicleAttributesByRentalClass: (args: { accessToken: string, rentalClass: string }) => Promise<VehicleAttributes>;
    rentalClasses: (args: { accessToken: string, selectedSmoking: string }) => Promise<string[]>;
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
    vehicleAttributesItem: (vehicleId: string) => Promise<void>;
    getReservationId: (callback) => void;
    getVehicleId: (callback) => void;
    updateReservationData: (callback: () => void) => void;
    updateVehicleAttributes: (callback: () => void) => void;
}

export interface webSocket {
    updateReservationData: (callback: () => void) => number;
    updateVehicleAttributes: (callback: () => void) => void;
}

export interface dialog {
    openFile: () => Promise<string>;
    openFileCancelled: () => Promise<void>;
}

export interface removeEvent {
    wsUpdateReservationData: (eventId: number) => void;
}

export interface accessToken {
    getAccessToken: (callback: (accessToken: string) => void) => void
}

declare global {
    interface Window {
        serverInfo: serverInfo;
        login: login;
        openWindow: openWindow;
        fetchJson: fetchJson;
        sqlSelect: sqlSelect;
        sqlInsert: sqlInsert;
        sqlUpdate: sqlUpdate
        contextMenu: contextMenu;
        webSocket: webSocket;
        dialog: dialog;
        removeEvent: removeEvent;
        accessToken: accessToken;
    }
}