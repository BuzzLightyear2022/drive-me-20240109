export interface serverInfo {
    serverHost: () => Promise<string>;
    port: () => Promise<string>;
    imageDirectory: () => Promise<string>;
}

export interface systemTimezone {
    getSystemTimezone: () => Promise<string>;
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
    selectOptions: () => Promise<SelectOptions | unknown>;
}

export interface sqlSelect {
    rentalCars: (args: { rentalClass?: string | null }) => Promise<RentalCar[]>;
    existingRentalClasses: (args: { selectedSmoking?: string }) => Promise<string[]>;
    vehicleAttributesById: (args: { vehicleId: number }) => Promise<VehicleAttributes>;
    vehicleAttributesByRentalClass: (args: { rentalClass: string }) => Promise<VehicleAttributes>;
    carModels: (args: { selectedSmoking: string, selectedRentalClass: string }) => Promise<string[]>;
    licensePlates: (args: { selectedSmoking: string, selectedCarModel: string }) => Promise<LicensePlatesData>;
    reservations: (args: { startDate?: Date, endDate?: Date }) => Promise<Reservation[]>;
    reservationDataById: (args: { reservationId: number }) => Promise<ReservationData>;
    latestVehicleStatuses: (args: { rentalClass?: string }) => Promise<any>;
}

export interface sqlInsert {
    vehicleAttributes: (args: { vehicleAttributes: VehicleAttributes }) => Promise<string>;
    reservationData: (reservationData: ReservationData) => Promise<string>;
    vehicleStatus: (args: { vehicleStatus: VehicleStatus }) => Promise<void>;
}

export interface sqlUpdate {
    reservationData: (reservationData: ReservationData) => Promise<void>;
    vehicleAttributes: (args: { vehicleAttributes: VehicleAttributes }) => Promise<void>
}

export interface contextmenu {
    scheduleBar: (reservationId: string) => Promise<void>;
    vehicleAttributesItem: (vehicleId: number) => Promise<void>;
    scheduleCell: (vehicleId: number) => Promise<void>;
    getReservationId: () => Promise<number>;
    getVehicleId: () => Promise<number>;
    updateReservationData: (callback: () => void) => void;
    updateVehicleAttributes: (callback: () => void) => void;
    getCrudArgs: () => any;
}

export interface webSocket {
    updateReservationData: (callback: () => void) => number;
    updateVehicleAttributes: (callback: () => void) => number;
    updateVehicleStatus: (callback: () => void) => number;
}

export interface dialog {
    openFile: () => Promise<string>;
    openFileCancelled: () => Promise<void>;
}

export interface removeEvent {
    wsUpdateReservationData: (eventId: number) => void;
    wsUpdateVehicleAttributes: (eventId: number) => void;
    wsUpdateVehicleStaus: (eventId: number) => void;
}

export interface accessToken {
    get: () => Promise<string>;
}

declare global {
    interface Window {
        serverInfo: serverInfo;
        systemTimezone: systemTimezone;
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