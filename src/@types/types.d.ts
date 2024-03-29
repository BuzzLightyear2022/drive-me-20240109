import { Datetime } from "aws-sdk/clients/costoptimizationhub"
import { time } from "aws-sdk/clients/frauddetector"

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
    isReplied: boolean,
    receptionDate: Date,
    repliedDate: Date,
    salesBranch: string,
    orderHandler: string,
    orderSource: string,
    furigana: string,
    nonSmoking: string,
    userName: string,
    preferredRentalClass: string,
    isElevatable: boolean,
    isClassSpecified: boolean,
    applicantName: string,
    preferredCarModel: string,
    zipCode: number,
    address: string,
    phoneNumber: number,
    pickupLocation: string,
    returnLocation: string,
    pickupDatetime: Datetime,
    arrivalFlightCarrier: string,
    arrivalFlightNumber: number,
    arrivalFlightTime: time,
    returnDatetime: Datetime,
    departureFlightCarrier: string,
    departureFlightNumber: number,
    departureFlightTime: time,
    newReturnDatetime: Datetime,
    selectedRentalClass: string,
    selectedCarModel: string,
    selectedVehicleId: number,
    comment: string,
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