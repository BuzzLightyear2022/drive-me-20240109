import { CarCatalog, LicensePlatesData, ReservationData, Navigations, VehicleAttributes, VehicleAttributesArray } from "../types";

export interface serverInfo {
    serverHost: () => Promise<string>;
    port: () => Promise<string>;
    imageDirectory: () => Promise<string>;
}

export interface login {
    getSessionData: (args: {
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
    vehicleAttributes: (args: { accessToken: string }) => Promise<VehicleAttributes[]>;
    vehicleAttributesById: (args: { accessToken: string, vehicleId: string }) => Promise<VehicleAttributes>;
    vehicleAttributesByRentalClass: (accessToken: string, args: { rentalClass: string }) => Promise<VehicleAttributes>;
    rentalClasses: (accessToken: string, args: { selectedSmoking: string }) => Promise<string[]>;
    carModels: (args: { selectedSmoking: string, selectedRentalClass: string }) => Promise<string[]>;
    licensePlates: (args: { selectedSmoking: string, selectedCarModel: string }) => Promise<LicensePlatesData>;
    reservationData: (accessToken: string, args: { startDate: Date, endDate: Date }) => Promise<>;
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
    getVehicleId: (callback: (accessToken: string, vehicleId: string) => void) => void;
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