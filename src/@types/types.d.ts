import { Datetime } from "aws-sdk/clients/costoptimizationhub"

export type Windows = {
    loginWindow: BrowserWindow,
    menuWindow: BrowserWindow,
    insertVehicleAttributesWindow: BrowserWindow,
    insertReservationWindow: BrowserWindow,
    displayReservationWindow: BrowserWindow,
    editReservationWindow: BrowserWindow,
    editVehicleAttributesWindow: BrowserWindow,
    editCarCatalogWindow: BrowserWindow,
    insertVehicleStatusWindow: BrowserWindow
}

export type CarCatalog = {
    rentalClass: {
        [rentalClassName: string]: {
            [carModel: string]: {
                modelCode?: string[],
                modelTrim?: string[],
                driveType?: string[],
                transmission?: string[],
                bodyColor?: string[]
            }
        }
    }
}

export type VehicleAttributes = {
    id?: number,
    imageFileName?: string,
    carModel: string,
    modelCode: string,
    modelTrim: string,
    seatingCapacity: number,
    nonSmoking: boolean,
    insurancePriority: boolean,
    licensePlateRegion: string,
    licensePlateCode: string,
    licensePlateHiragana: string,
    licensePlateNumber: string,
    bodyColor: string,
    driveType: string,
    transmission: string,
    rentalClass: string,
    navigation: string,
    hasBackCamera: boolean,
    hasDVD: boolean,
    hasTelevision: boolean,
    hasExternalInput: boolean,
    hasETC: boolean,
    hasSpareKey: boolean,
    hasJAFCard: boolean,
    JAFCardNumber?: string,
    JAFCardExp?: Date,
    otherFeatures?: string
}

export type ReservationData = {
    id?: number
    vehicleId: number,
    reservationName: string,
    rentalCategory: string,
    pickupLocation: string,
    returnLocation: string,
    pickupDateObject: Date,
    returnDateObject: Date,
    nonSmoking: string,
    comment?: string,
    isCanceled: boolean
}

export type LicensePlatesData = Array<{
    id: number,
    licensePlate: string
}>

export type Navigations = {
    navigations: string[]
}

export type CalendarInfo = {
    innerVehicleScheduleContainer: HTMLDivElment | undefined;
    year: number | undefined;
    monthIndex: number | undefined;
    vehicleAttributesArray: VehicleAttributes[];
}

export type ScheduleBarInfo = {
    reservationData: ReservationData;
    divElement: HTMLDivElement;
    instance
}

export type IntersectObject = {
    observer: IntersectionObserver;
    divElement: HTMLDivElement;
}

export type CarLocation = {
    location: string[];
}

export type VehicleStatus = {
    id?: number,
    vehicleId: number,
    currentLocation: string,
    washState: string,
    comment: string,
    createdAt: Datetime,
    updatedAt: Datetime
}