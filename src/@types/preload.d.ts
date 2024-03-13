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
    carCatalog: () => Promise<CarCatalog | unknown>;
    navigations: () => Promise<Navigations | unknown>;
    carLocation: () => Promise<CarLocation | unknown>;
}

export interface sqlSelect {
    vehicleAttributes: () => Promise<VehicleAttributes[]>;
    vehicleAttributesById: (args: { vehicleId: number }) => Promise<VehicleAttributes>;
    vehicleAttributesByRentalClass: (args: { rentalClass: string }) => Promise<VehicleAttributes>;
    rentalClasses: (args: { selectedSmoking: string }) => Promise<string[]>;
    carModels: (args: { selectedSmoking: string, selectedRentalClass: string }) => Promise<string[]>;
    licensePlates: (args: { selectedSmoking: string, selectedCarModel: string }) => Promise<LicensePlatesData>;
    reservationData: (args: { startDate: Date, endDate: Date }) => Promise<>;
    reservationDataById: (args: { reservationId: number }) => Promise<ReservationData>;
}

export interface sqlInsert {
    vehicleAttributes: (args: { vehicleAttributes: VehicleAttributes }) => Promise<string>;
    reservationData: (reservationData: ReservationData) => Promise<string>
}

export interface sqlUpdate {
    reservationData: (reservationData: ReservationData) => Promise<void>;
    vehicleAttributes: (args: { vehicleAttributes: VehicleAttributes }) => Promise<void>
}

export interface contextmenu {
    scheduleBar: (reservationId: number) => Promise<void>;
    vehicleAttributesItem: (vehicleId: number) => Promise<void>;
    scheduleCell: (vehicleId: number) => Promise<void>;
    getReservationId: () => Promise<number>;
    getVehicleId: () => Promise<number>;
    updateReservationData: (callback: () => void) => void;
    updateVehicleAttributes: (callback: () => void) => void;
}

export interface webSocket {
    updateReservationData: (callback: () => void) => number;
    updateVehicleAttributes: (callback: () => void) => number;
}

export interface dialog {
    openFile: () => Promise<string>;
    openFileCancelled: () => Promise<void>;
}

export interface removeEvent {
    wsUpdateReservationData: (eventId: number) => void;
}

export interface accessToken {
    get: () => Promise<string>;
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
        contextmenu: contextmenu;
        webSocket: webSocket;
        dialog: dialog;
        removeEvent: removeEvent;
        accessToken: accessToken;
    }
}